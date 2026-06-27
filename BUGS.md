# バグ記録・教訓まとめ

このプロジェクトで発生したバグとその原因・修正内容の記録。
次回 Claude Code に共有することで同じ問題を素早く解決できる。

---

## Bug 1: 白画面・初回ロードが遅い

**症状**
- サイトを開くと数秒間、真っ白な画面が続く

**原因**
- `App.tsx` で `if (!synced) return null` としていた
- Supabase の読み込み完了まで何も表示しない
- AdminPage（XLSX含む）が初期バンドルに含まれており 905KB あった

**修正**
- `return null` → スピナー表示に変更
- `localStorage` にデータがあれば `synced=true` で即レンダリング（再訪問者向け）
- `React.lazy()` で AdminPage を遅延ロード → 初期バンドル 506KB に削減

---

## Bug 2: PC とスマホで表示内容が異なる

**症状**
- PC では正しい大会情報（高田城ロードレース）が表示される
- スマホでは「要確認」の古い情報が表示される

**原因**
- 静的ファイル（`niigata-events-draft.ts`）に古いデータ
- Supabase に正しいデータがあったが、スマホ初回訪問時は Supabase 読み込み前に静的データで表示していた
- `useMemo` の依存配列に `version` がなく、Supabase 読み込み後に再計算されなかった

**修正**
- `SyncedContext` に `version` カウンターを追加
- `const event = useMemo(() => getEventByIdAll(id), [id, version])` で Supabase 完了後に再計算
- 静的ファイルのデータを正しい内容に更新

---

## Bug 3: スマホで「大会が見つかりませんでした」（最も深刻）

**症状**
- スマホ（シークレットモード含む）で特定の大会ページが 404 になる
- PC では正常に表示される

**根本原因：Vercel 環境変数への BOM 混入**
- `VITE_SUPABASE_SERVICE_KEY` を Vercel に貼り付けた際、先頭に BOM（`﻿`、見えない文字）が混入
- ビルドされた JS のキーが `﻿eyJhbGci...` となり Supabase 認証が失敗
- スマホ（キャッシュなし）は Supabase から読み込む必要があるため失敗
- PC は `localStorage` キャッシュがあったため Supabase を使わずに動いていた

**副原因：404 の早期表示**
- `!event && !synced` の条件が実質的に dead code（EventDetailPage レンダリング時は常に `synced=true`）
- Supabase ロード前に 404 が表示されてしまうケースがあった

**修正**
```ts
// supabaseAdmin.ts: BOM除去
const supabaseServiceKey = (import.meta.env.VITE_SUPABASE_SERVICE_KEY as string ?? '')
  .replace(/^﻿/, '').trim();
```
```tsx
// EventDetailPage.tsx: version===0(未ロード)の間は404を出さない
if (!event && (!synced || version === 0)) return <Spinner />
```
```ts
// syncDB.ts: 空配列が返った場合はlocalStorageを上書きしない
if (!data || data.length === 0) return;
```

**診断方法**
本番 JS バンドルにキーが正しく埋め込まれているか確認：
```js
// Node.js で実行
const js = /* 本番JSを取得 */;
const idx = js.indexOf('eyJhbGci...');
console.log(js.slice(idx - 50, idx + 10)); // ﻿ が見えたらBOM混入
```

---

## Bug 4: Supabase RLS でデータ読み込み失敗

**症状**
- `loadFromSupabase()` が空配列を返す
- ログ: anon key → status 200 だが data: `[]`

**原因**
- `admin_settings` テーブルに RLS が設定されており、anon ユーザーは SELECT 不可
- `syncDB.ts` が anon key でクエリしていた

**修正**
- `supabaseAdmin`（service_role キー）を使用するよう変更
- service_role キーは RLS をバイパスするため全レコードを取得できる

**注意**
- `VITE_SUPABASE_SERVICE_KEY` は `VITE_` プレフィックスにより**ブラウザの JS に埋め込まれる**（公開される）
- service_role キーはサーバーサイドのみで使用するのがベストプラクティス
- 将来的には anon SELECT ポリシーを追加し、anon key で読み込む構成に移行することを検討

---

## Bug 5: 静的データと Supabase データの二重管理

**症状**
- 大会データが静的ファイルと Supabase の両方に存在し、どちらが正しいか分かりにくい
- 静的ファイルの古いデータがスマホで表示される

**修正**
- Node.js スクリプトで静的データを Supabase `adminCreatedEvents` に一括移行
- 静的ファイル（`events.ts`, `niigata-events-draft.ts`）を空配列に変更
- 全イベントを管理画面から管理するシングルソース構成に移行

---

## Bug 6: 開催日を直しても保存するたびに単一日に戻る

**症状**
- 大会の開催日を「9月19日・20日の2日間」に修正しても、しばらくすると単一日（9月20日）表示に戻ってしまう

**原因**
- `EventVisualPanel`（大会ビジュアル設定タブ）は開く度に `eventDate` を大会本体の値から初期化する
- このタブを保存すると、catchCopy やハイライトなど別の項目を直すだけのつもりでも `eventVisualSettings.eventDate`（単一日付）が必ず一緒に上書き保存される
- `applyDateOverride()` はこの上書きを大会本体の `date` より優先するため、単一日付に戻って見える

**修正**
- `MarathonEvent` / `EventVisualSetting` に `eventDateEnd`（終了日・任意）を追加
- `formatEventDateRange(start, end)` を新設し、終了日がある場合は「◯月◯日（曜）・◯日（曜）の2日間」または「◯月◯日〜◯月◯日」形式で表示
- 管理画面の開催日入力（ビジュアル設定／大会情報編集／新規登録／静的データ上書きの4箇所）すべてに終了日inputを追加
- `isPastEvent()` は `eventDateEnd ?? eventDate` で判定するよう変更（複数日大会が最終日まで表示され続けるように）

**教訓**: 開催日のような「複数箇所に保存先がある」項目を直す時は、表示優先順位（`applyDateOverride` → `applyAdminOverrides`）を必ず確認すること。1箇所だけ直しても他のタブの保存で巻き戻ることがある。

---

## 共通の教訓

| 教訓 | 詳細 |
|------|------|
| Vercel env var の BOM に注意 | 貼り付け時に見えない文字が混入することがある。キーをコピーするときはテキストエディタ経由ではなく直接貼り付ける |
| `VITE_` 変数はビルド時に埋め込まれる | 追加・変更後は**必ず再デプロイが必要** |
| PC キャッシュに惑わされない | PC で動いても、スマホ（初回訪問）では Supabase 読み込みが必須なため別の挙動になる |
| anon key は RLS で制限される | Supabase のテーブルに RLS がある場合、anon key は SELECT できない可能性がある |
| `!synced` は EventDetailPage 内で dead code になりやすい | App.tsx がスピナーを出している間は EventDetailPage がレンダリングされないため |
| 宿泊エリアは `eventAccommodationOverrides` が優先される | `adminCreatedEvents` の `accommodations` を変更しても表示に反映されない。`applyAdminOverrides()` で override が存在する場合はそちらが上書きするため、スクリプトで両方を更新する必要がある |
