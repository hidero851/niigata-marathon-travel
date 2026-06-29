# 新潟マラソンナビ — 画面・管理画面仕様書

> 最終更新: 2026-05-14

---

## 目次

1. [システム概要](#1-システム概要)
2. [画面一覧・URL設計](#2-画面一覧url設計)
3. [公開画面仕様](#3-公開画面仕様)
   - 3.1 トップページ
   - 3.2 大会一覧ページ
   - 3.3 大会詳細ページ
   - 3.4 特産品詳細ページ
4. [管理画面仕様](#4-管理画面仕様)
   - 4.1 ログイン
   - 4.2 タブ構成
   - 4.3 注目大会タブ
   - 4.4 大会管理タブ（基本情報＋詳細設定サブタブ）
   - 4.5 特産品設定タブ
   - 4.6 一覧管理タブ
   - 4.7 データ管理タブ
5. [データ設計](#5-データ設計)
6. [インフラ・技術スタック](#6-インフラ技術スタック)

---

## 1. システム概要

新潟県内のマラソン大会を探せる旅行情報サイト。
ランナーが大会選び・宿泊手配・現地グルメ・特産品をワンストップで調べられることを目的とする。

| 項目 | 内容 |
|------|------|
| サービス名 | 新潟マラソンナビ |
| URL | Vercel にデプロイ（GitHub main ブランチと自動連携） |
| 対象ユーザー | 新潟のマラソン大会に参加する・参加を検討するランナー |
| 翻訳対応 | Google Translate ウィジェット（日/英/中繁/中簡/韓） |
| アクセス解析 | Google Analytics 4（GA4）+ 独自イベントログ（localStorage） |
| アフィリエイト | 楽天トラベル |

---

## 2. 画面一覧・URL設計

| パス | 画面名 | 認証 |
|------|--------|------|
| `/` | トップページ | 不要 |
| `/events` | 大会一覧ページ | 不要 |
| `/events/:id` | 大会詳細ページ | 不要 |
| `/products/:id` | 特産品詳細ページ | 不要 |
| `/admin/login` | 管理者ログイン | 不要 |
| `/admin` | 管理画面 | **Supabase 認証必須** |
| `/datasource` | データ出典ページ | **Supabase 認証必須** |
| `/privacy` | プライバシーポリシー | 不要 |

---

## 3. 公開画面仕様

### 3.1 トップページ (`/`)

#### 構成セクション（上から順）

| # | セクション | 内容 |
|---|-----------|------|
| 1 | エントリーアラート | エントリー締切が近い大会のバナー表示（設定日数以内に締切が迫った大会のみ） |
| 2 | ヒーロー検索 | 地域・月・距離の3項目でプルダウン検索。「大会を探す」ボタンで大会一覧へ遷移 |
| 3 | サービスコンセプト | 大会を選ぶ→宿泊を決める→旅を楽しむ の3ステップカード |
| 4 | 注目の大会 | 管理画面で選択した大会をカード表示（最大件数は管理側で制御） |
| 5 | タグで探す | 日本海グルメ・温泉・地酒・米どころ・城下町・紅葉・雪景色・佐渡 の8タグ |
| 6 | 全大会一覧へ誘導 | 「すべての大会を見る」ボタン |

#### データ取得

- `getAllDisplayableEvents()` — `draft: true` の大会は除外
- 注目大会: `getFeaturedSettings()` で取得した表示順・ON/OFFを適用

---

### 3.2 大会一覧ページ (`/events`)

#### 機能

| 機能 | 詳細 |
|------|------|
| 絞り込み | 地域・月・距離・タグの4軸。URLクエリパラメータと連動 |
| 大会カード | 大会名・日程・場所・距離・タグバッジ・キャッチコピーを表示 |
| 画像 | ヒーロー画像（あれば）またはグラデーション |

---

### 3.3 大会詳細ページ (`/events/:id`)

#### セクション一覧と表示制御

各セクションは管理画面の「ビジュアル設定 > セクション表示制御」で個別に非表示にできる。

| セクション ID | 表示内容 | 非表示可否 |
|--------------|---------|-----------|
| *(常時)* | ヒーロー画像・キャッチコピー・大会基本情報（日程・場所・距離・参加費・制限時間・エントリー情報） | 不可 |
| `highlights` | このレースで楽しめること（カード形式、画像付き） | ○ |
| `modelPlans` | おすすめ参加プラン（ステップ形式、楽天リンク付き） | ○ |
| `accommodations` | ランナー向けおすすめ宿泊エリア（カード形式、楽天リンク付き） | ○ |
| `areaAttraction` | エリアの魅力（宿泊セクション内。観光・地元グルメ・旅の思い出の3ボタン） | ○ |
| `products` | 食・特産・お土産（特産品カード一覧） | ○ |
| `entryCta` | エントリー誘導バナー | ○ |

#### エリアの魅力リンク

3つのボタンに個別URLを設定できる。未設定の場合は共通URL（`areaRakutenUrl`）にフォールバック。さらに未設定の場合は楽天トラベルのキーワード検索URLを自動生成する。

| ボタン | 設定キー |
|--------|---------|
| 🗺️ 観光 | `areaKankoUrl` |
| 🍽️ 地元グルメ | `areaGourmetUrl` |
| 📸 旅の思い出 | `areaMemoryUrl` |
| 共通フォールバック | `areaRakutenUrl` |

#### 備考（notes）の改行・簡易記法

`whitespace-pre-wrap` CSS を適用しているため、管理画面の備考テキストエリアで改行した内容がそのまま公開ページに反映される。

備考テキストは `renderStepText()`（`EventDetailPage.tsx`）で以下の簡易記法を解釈する（おすすめ参加プランの手順テキストと共通の関数）。

| 記法 | 表示 |
|------|------|
| `**強調したい文章**` | 太字（`<strong>`） |
| `[リンク文字](URL)` | 新しいタブで開くリンク |

太字とリンクを同時に使いたい場合、リンク部分の前後で `**` を分けて記述する（例: `**前半**[リンク文字](URL)**後半**`）。`**...**` の中に `[...](...)` を入れ子にすると正しく解釈されない。

#### データ優先順位

```
管理画面オーバーライド（adminSettings） > 静的データ（events.ts）
```

---

### 3.4 特産品詳細ページ (`/products/:id`)

#### セクション一覧と表示制御

管理画面の「特産品設定 > セクション表示制御」で個別に非表示にできる。

| セクション ID | 表示内容 | 非表示可否 |
|--------------|---------|-----------|
| *(常時)* | ヒーロー（グラデーション画像）・エリア・商品名・短い説明文 | 不可 |
| `gallery` | 商品画像ギャラリー（横スクロール、管理画面で複数URL登録） | ○ |
| `description` | この特産について（詳細説明文） | ○ |
| `salesLocations` | 購入できる場所（リスト形式）/ どこで買えるか（文章形式） | ○ |
| `shops` | お店で買う（店舗情報・地図） | ○ |
| `externalLink` | 公式サイトリンク（サイドバー） | ○ |
| `relatedEvents` | 関連する大会（サイドバー） | ○ |

#### 店舗情報（shopsセクション）

1店舗ごとに以下の情報を表示。すべてのフィールドは任意。

| フィールド | 表示内容 |
|-----------|---------|
| `name` | 店名（必須） |
| `address` | 住所（MapPin アイコン付き） |
| `hours` | 営業時間（🕐付き） |
| `description` | 店舗説明文 |
| `mapEmbedUrl` | Google Maps 埋め込み地図（iframe） |
| `mapUrl` | Google Maps リンク（「Google Mapsで見る →」） |

#### 購入場所の優先順位

```
大会ごとのオーバーライド（productOverrides.whereToBuy）
  > 特産品ビジュアル設定（visualSetting.whereToBuy）
  > 静的データ（baseProduct.whereToBuy）
```

#### 外部リンクの扱い

`externalUrl` が未設定または `#` の場合、「公式サイト（設定中）」と表示しグレーアウトする。

---

## 4. 管理画面仕様

URL: `/admin`（Supabase メール認証が必須）

### 4.1 ログイン

- パス: `/admin/login`
- Supabase Auth（メール + パスワード）で認証
- 未認証状態で `/admin` にアクセスするとログインページにリダイレクト

---

### 4.2 タブ構成

管理画面はトップレベルで4タブに分かれる。

| タブ ID | タブ名 | アイコン |
|--------|--------|--------|
| `featured` | トップ表示 | Star |
| `eventManage` | 大会管理 | CalendarDays |
| `listManage` | 一覧管理 | FileSpreadsheet |
| `data` | データ管理 | BarChart2 |

---

### 4.3 トップ表示タブ (`featured`)

トップページの背景画像と「注目の大会」を管理する。

#### 4.3.1 トップページ背景画像（フェード表示）

トップページ検索エリアの背景に、数秒ごとにフェード切り替わる画像を管理する。

| 操作 | 内容 |
|------|------|
| 画像を追加 | アップロードして一覧に追加（Storage: `site/hero-{timestamp}.{ext}`） |
| URL直接入力 | 画像URLを直接編集可能 |
| キャプション | 任意入力。未入力ならキャプション非表示、入力時は画像右下に半透明の帯で表示 |
| 並び替え | ↑↓ボタンで表示順を変更 |
| 削除 | 一覧から画像を削除 |
| 保存 | Supabase に即時同期 |

1枚も登録しない場合は `public/images/hero/hero1.jpg`〜`hero5.jpg`（コード内の既定画像）が使われる。

#### 4.3.2 注目大会

トップページの「注目の大会」に表示する大会を管理する。

| 操作 | 内容 |
|------|------|
| チェックボックス | 注目大会の ON/OFF 切り替え |
| 表示順 | 数値入力（小さい順で上位表示） |
| 保存 | Supabase に即時同期 |
| リセット | デフォルト（先頭3件）に戻す |

---

### 4.4 大会管理タブ (`eventManage`)

#### ドロップダウン大会選択

タブ上部のドロップダウンで大会を選択すると、**基本情報フォーム**と**詳細設定サブタブ**が同時に表示される。

#### 基本情報フォーム

| 対象 | 表示内容 |
|------|---------|
| 管理画面登録大会 | 全フィールドの編集フォームが表示される。「保存」ボタンで即時反映 |
| 静的データの大会 | 開催日フィールドのみ表示（`eventVisualSetting.eventDate`／`eventDateEnd` として保存） |

開催日は開始日（`eventDate`）と終了日（`eventDateEnd`、複数日開催の場合のみ入力）の2つの date input で構成される。終了日を入力すると「YYYY年M月D日（曜）・D日（曜）の2日間」（同月）または「YYYY年M月D日（曜）〜YYYY年M月D日（曜）」（異月）の表示になる（`formatEventDateRange`、`src/data/index.ts`）。終了日未入力時は従来通り単一日表示。

#### 新規大会登録フォーム

| フィールド | 必須 | 備考 |
|-----------|------|------|
| 大会名 | ○ | |
| 開催日 | | `YYYY-MM-DD` 形式。未設定時「未定」表示 |
| 開催地（市区町村） | | 未設定時「未設定」 |
| 会場名 | | |
| 距離 | | カンマ区切り複数入力（例: `10km, ハーフ, フル`） |
| キャッチコピー | | |
| 参加費 | | 未設定時「要確認」 |
| 定員 | | 未設定時「要確認」 |
| 制限時間 | | 未設定時「要確認」 |
| スタート地点 | | |
| ゴール地点 | | |
| アクセス | | |
| エントリー期間（テキスト） | | |
| 主催者 | | |
| 公式サイトURL | | |
| エントリーURL | | 未設定時は公式URLを使用 |
| 楽天トラベルURL | | 設定すると自動で宿泊エリアを1件生成 |
| ヒーロー画像URL | | |
| タグ | | カンマ区切り |
| 備考 | | 改行対応（`whitespace-pre-wrap`） |
| エントリー開始日 | | `YYYY-MM-DD` |
| エントリー締切日 | | `YYYY-MM-DD` |

> 新規登録は常に **下書き（draft: true）** として保存される。公開は「一覧管理」タブから行う。

#### 詳細設定サブタブ

ドロップダウンで大会を選択すると以下の6サブタブが表示される。

---

##### サブタブ: ビジュアル設定 (`visual`)

大会詳細ページの見た目を上書き設定する。静的データにない場合のデフォルト値として機能。

| フィールド | 内容 |
|-----------|------|
| 公式サイトURL | 大会詳細ページに表示するURL |
| 開催日 | 開始日・終了日（複数日開催の場合のみ）の date input。日本語フォーマットに自動変換して表示。**注意**: このタブを保存すると `eventDate`／`eventDateEnd` が必ず上書きされるため、複数日開催の大会は終了日も入力しておくこと（未入力のまま保存すると単一日表示に戻る） |
| ヒーロー画像URL | 画像プレビュー付き |
| ヒーロー画像 Alt テキスト | |
| キャッチコピー | |
| サブタイトル | |
| 前泊推奨リンク（楽天トラベルURL） | |
| エリアの魅力リンク | 🗺️観光 / 🍽️グルメ / 📸旅の思い出 / 共通フォールバック の4URL |
| **セクション表示制御** | highlights / modelPlans / accommodations / areaAttraction / products / entryCta の各セクションをチェックで非表示化 |
| **見どころカード（CRUD）** | 追加・削除・編集。タイトル・画像URL・説明文を1カードに設定 |

---

##### サブタブ: 宿泊エリア (`accommodations`)

大会詳細ページの宿泊エリアカードを管理。設定するとデフォルトデータを完全に上書き。

| フィールド | 必須 |
|-----------|------|
| ラベル（例: 当日ラク重視） | |
| エリア名 | ○ |
| 会場からの距離 | |
| 価格帯 | |
| 楽天トラベルURL | |
| 外部リンクURL | |
| 説明文 | |

操作: 追加・編集（行内フォーム）・削除（confirm付き）

---

##### サブタブ: 参加プラン (`modelPlans`)

大会詳細ページの「おすすめ参加プラン」を管理。設定するとデフォルトデータを完全に上書き。

| フィールド | 必須 |
|-----------|------|
| プランタイトル | ○ |
| 楽天トラベルURL | |
| ステップ（複数行） | |

操作: 追加・編集・削除・ステップの追加/削除

---

##### サブタブ: 特産品設定 (`products`)

**大会詳細ページに紐づけた特産品** のビジュアル設定（`ProductVisualPanel` を大会タブ内でも参照）。

---

##### サブタブ: 特産品紐づけ (`productAssign`)

この大会の詳細ページに表示する特産品を選択。大会専用の「購入場所テキスト」を上書き設定できる。

| 操作 | 内容 |
|------|------|
| チェックボックス | 表示する特産品を選択 |
| 購入場所テキスト（大会専用） | チェック済み特産品に個別テキストを設定。未入力時はグローバル設定を使用 |

---

##### サブタブ: 独自特産品 (`localProductsAdmin`)

この大会専用の特産品・グルメ情報を追加（グローバル特産品データとは別管理）。

| フィールド | 必須 |
|-----------|------|
| 名称 | ○ |
| エリア | |
| 短い説明 | |
| おすすめポイント | |
| 購入場所 | |
| 外部リンクURL | |
| 画像URL | |
| 詳細説明 | |

---

##### サブタブ: エントリー日程 (`entryDates`)

全大会のエントリー開始日・締切日を一括管理。

| 機能 | 内容 |
|------|------|
| アラート表示日数 | トップページに何日前からアラートを出すか（1〜60日、デフォルト30日） |
| 大会別エントリー日程 | 開始日・締切日を date input で設定し大会ごとに保存 |

締切日が「今日から N日以内」に含まれる大会がトップページにアラート表示される。

---

### 4.5 特産品設定タブ (`products` トップレベル)

グローバルな特産品のビジュアル設定を管理する。特産品を選択して以下を編集。

| フィールド | 内容 |
|-----------|------|
| 画像URL | 画像プレビュー付き |
| 画像 Alt テキスト | |
| 短い説明文（カード表示） | |
| 詳細説明文 | |
| 公式サイトURL | |
| 商品画像リスト | 1行1URL。横スクロールギャラリーとして特産品詳細ページに表示 |
| 購入場所テキスト（共通・文章形式） | |
| 販売場所リスト（1行1件） | 箇条書き形式で表示 |
| **セクション表示制御** | gallery / description / salesLocations / shops / externalLink / relatedEvents の各セクションをチェックで非表示化 |
| **お店情報（CRUD）** | 店舗の追加・削除 |

#### お店情報 フィールド

| フィールド | 内容 |
|-----------|------|
| 店名 | 必須 |
| 住所 | MapPin アイコン付きで表示 |
| 営業時間 | 例: `9:00〜18:00` |
| 店舗の説明 | |
| Google Maps URL | 「Google Mapsで見る →」リンク |
| Google Maps 埋め込みURL | iframe で地図を埋め込み表示。Google Maps の「共有 > 地図を埋め込む」の src 値を貼り付け |

---

### 4.6 一覧管理タブ (`listManage`)

すべての大会（静的データ + 管理画面登録）の一覧表示と、公開状態の管理・削除・インポートを行う。

| 操作 | 対象 | 内容 |
|------|------|------|
| プレビュー（Eye） | すべての大会 | 別タブで大会詳細ページを開く |
| 公開/下書き切替（Globe） | 管理画面登録大会のみ | `draft: true/false` を切替 |
| 削除（Trash） | すべての大会 | 管理登録→完全削除、静的データ→非表示扱い |

#### Excelインポート

Excel（XLSX）ファイルから大会データを一括インポートする機能。同タブ下部に統合。

---

### 4.7 データ管理タブ (`data`)

ユーザー行動ログ（localStorage に保存された独自イベント）の確認とクリア。

---

## 5. データ設計

### データの保存場所

| データ種別 | 保存先 |
|-----------|--------|
| 静的大会データ | `src/data/events.ts`（ソースコード） |
| 静的特産品データ | `src/data/products.ts`（ソースコード） |
| 管理画面設定（全種） | Supabase `admin_settings` テーブル（主）+ localStorage（キャッシュ） |

### Supabase admin_settings テーブルのキー一覧

| key | 内容 |
|-----|------|
| `featuredEventSettings` | 注目大会の表示設定 |
| `heroImages` | トップページ背景フェード画像リスト |
| `eventVisualSettings` | 大会ビジュアル設定（ヒーロー画像・キャッチコピー・見どころカード等） |
| `productVisualSettings` | 特産品ビジュアル設定（画像・説明文・店舗情報等） |
| `adminCreatedEvents` | 管理画面から登録した大会データ |
| `hiddenEventIds` | 静的データから非表示にしたイベントIDリスト |
| `eventProductAssignments` | 大会×特産品の紐づけ・購入場所テキスト上書き |
| `eventAccommodationOverrides` | 大会ごとの宿泊エリア上書き |
| `eventModelPlanOverrides` | 大会ごとの参加プラン上書き |
| `eventAdminLocalProducts` | 大会専用の独自特産品 |
| `eventEntryDates`（予定） | エントリー開始日・締切日 |
| `entryAlertDays`（予定） | アラート表示日数 |

### 主要な型定義

```typescript
// 大会
type MarathonEvent = {
  id: string; name: string; location: string; prefecture: string;
  date: string; eventDate?: string; month: string; distances: string[];
  catchCopy: string; tags: string[]; entryUrl: string; officialUrl: string;
  fee: string; capacity: string; timeLimit: string;
  startPoint: string; goalPoint: string;
  venue?: string; entryPeriod?: string; organizer?: string;
  access?: string; notes?: string;
  heroImageUrl?: string; imageGradient?: string;
  highlights?: EventHighlight[];
  accommodations: Accommodation[];
  localProducts: LocalProduct[];
  modelPlans: ModelPlan[];
  sourceInfo: SourceInfo[];
  draft?: boolean; // true の場合は公開一覧に出ない
};

// 大会ビジュアル設定
type EventVisualSetting = {
  eventId: string; heroImageUrl: string; heroImageAlt: string;
  catchCopy: string; subtitle: string; officialUrl: string;
  eventDate?: string;
  prevNightRakutenUrl?: string; areaRakutenUrl?: string;
  areaKankoUrl?: string; areaGourmetUrl?: string; areaMemoryUrl?: string;
  highlights: EventHighlightSetting[];
  hiddenSections?: string[]; // 非表示にするセクションIDのリスト
};

// 特産品
type LocalProduct = {
  id: string; name: string; area: string;
  imageUrl: string; imageGradient?: string;
  shortDescription: string; description: string;
  recommendedPoint: string; whereToBuy: string;
  salesLocations?: string[]; externalUrl: string;
  relatedEventIds: string[]; sourceInfo: SourceInfo[];
};

// 特産品ビジュアル設定
type ProductVisualSetting = {
  productId: string; imageUrl: string; imageAlt: string;
  shortDescription: string; description: string; externalUrl: string;
  salesLocations?: string[]; whereToBuy?: string;
  images?: string[];       // 横スクロールギャラリー用URL配列
  shops?: ProductShop[];   // 店舗情報
  hiddenSections?: string[]; // 非表示にするセクションIDのリスト
};

// 店舗情報
type ProductShop = {
  name: string; address?: string; hours?: string;
  description?: string; mapUrl?: string; mapEmbedUrl?: string;
};
```

---

## 6. インフラ・技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | React 18 + TypeScript + Vite |
| スタイリング | Tailwind CSS |
| ルーティング | React Router v6 |
| 認証 | Supabase Auth（メール+パスワード） |
| DB | Supabase（PostgreSQL）`admin_settings` テーブル |
| キャッシュ | localStorage（Supabase との双方向同期） |
| デプロイ | Vercel（GitHub main ブランチ自動デプロイ） |
| アクセス解析 | Google Analytics 4（計測ID: G-F3DYQK153E） |
| 翻訳 | Google Translate ウィジェット（固定位置: 画面右下） |
| アイコン | lucide-react |
| アフィリエイト | 楽天トラベル（楽天アフィリエイトリンク） |

### データフロー

```
アプリ起動
  └─ localStorage にキャッシュがある → 即時表示
  └─ Supabase から最新データを取得 → localStorage 更新 → 画面を再描画

管理画面で保存
  └─ localStorage に書き込み（即時反映）
  └─ Supabase に非同期保存
```

### 管理画面の遅延ロード

`AdminPage` は XLSX インポート機能等の重いライブラリを含むため、`React.lazy()` で遅延ロードされる。公開ページの初期バンドルには含まれない。

---

## 7. PC交換時の開発環境復旧手順

### 7.1 前提：クラウドに保存済みのもの

| データ | 保存先 | 備考 |
|--------|--------|------|
| ソースコード | GitHub `hidero851/niigata-marathon-travel` | main ブランチ |
| 大会・設定データ | Supabase DB | 自動で復元される |
| 画像 | Supabase Storage | 自動で復元される |
| 仕様書・バグ記録・スクリプト | Google Drive「marathon-navi バックアップ」 | 手動で取得 |
| 環境変数 | Supabase ダッシュボード + Vercel | 以下の手順で再取得 |

---

### 7.2 復旧手順

#### ① 開発ツールのインストール

```
1. Node.js（LTS版）をインストール
2. Git をインストール
3. VS Code などエディタをインストール
4. Claude Code をインストール
```

#### ② リポジトリの取得

```bash
git clone https://github.com/hidero851/niigata-marathon-travel.git
cd niigata-marathon-travel
npm install
```

#### ③ 環境変数の復元

プロジェクトルートに `.env.local` を作成し、以下を記入する。

```
VITE_SUPABASE_URL=         ← Supabase > Project Settings > API > Project URL
VITE_SUPABASE_ANON_KEY=    ← Supabase > Project Settings > API > anon public
VITE_SUPABASE_SERVICE_KEY= ← Supabase > Project Settings > API > service_role（secret）
VITE_ADMIN_EMAIL=          ← 管理者のメールアドレス
VITE_ADMIN_PASSWORD=       ← 管理者のパスワード
```

> ⚠️ `VITE_SUPABASE_SERVICE_KEY` を貼り付けるときは **テキストエディタを経由せず直接貼る**。BOM（見えない文字）が混入するとスマホでデータが読み込めなくなる（BUGS.md Bug 3 参照）。

#### ④ ローカル起動・動作確認

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開き、大会一覧が表示されれば復旧完了。

#### ⑤ Claude Code に渡す情報

新しい PC で Claude Code を起動したら、以下を伝えるだけで開発を再開できる。

```
・このプロジェクトは marathon-navi.com（新潟マラソンナビ）のソースコードです
・GitHub: https://github.com/hidero851/niigata-marathon-travel
・技術スタック: React 18 + TypeScript + Vite + Tailwind CSS + Supabase + Vercel
・仕様書: Google Drive「marathon-navi バックアップ」内の SPEC.md を参照
・バグ記録: 同フォルダの BUGS.md を参照
```
