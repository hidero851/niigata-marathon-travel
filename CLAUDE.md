# 新潟マラソンナビ — Claude Code 引き継ぎメモ

## プロジェクト概要

- サービス名: 新潟マラソンナビ（marathon-navi.com）
- 新潟県のマラソン大会・宿泊・特産品をまとめた旅行情報サイト
- GitHub: https://github.com/hidero851/niigata-marathon-travel
- 本番: Vercel（GitHub main ブランチ自動デプロイ）
- 詳細仕様: SPEC.md を参照

## 技術スタック

- React 18 + TypeScript + Vite + Tailwind CSS
- Supabase（認証・DB・Storage）
- React Router v6 / lucide-react / react-helmet-async

## データの仕組み

- 全大会データは Supabase の `admin_settings` テーブルに保存（キー: `adminCreatedEvents`）
- 静的ファイル `src/data/events.ts` は空配列（Supabase に移行済み）
- アプリ起動時に Supabase → localStorage に同期。localStorage をキャッシュとして使う
- 管理画面（`/admin`）は Supabase Auth 必須。`React.lazy()` で遅延ロード

## よく使うコマンド

```bash
npm run dev      # ローカル起動 → http://localhost:5173
npm run build    # ビルド確認
git push origin main  # Vercel に自動デプロイ
```

## 重要な注意事項

- **draft フラグは絶対に触らない**: 大会の `draft: true/false` はユーザーのみが変更する。スクリプトや修正で勝手に変えてはならない
- **BOM混入に注意**: Vercel に `VITE_SUPABASE_SERVICE_KEY` を貼る際にテキストエディタ経由にすると見えない文字が混入し、スマホでデータが読めなくなる（BUGS.md Bug 3 参照）
- **gradient はCSS形式で記述**: Tailwindクラス名はインラインスタイルで機能しない

## ファイル構成（主要部分）

```
src/
  pages/          # TopPage, EventDetailPage, ProductDetailPage, AdminPage など
  components/     # EventCard, ProductCard, AutoScrollCarousel など
  utils/
    supabase.ts       # Supabase クライアント（anon key）
    supabaseAdmin.ts  # Supabase クライアント（service key）
    syncDB.ts         # Supabase ↔ localStorage 同期
    adminSettings.ts  # localStorage からの設定読み込みヘルパー
    imageUpload.ts    # Supabase Storage への画像アップロード
    ga4.ts            # GA4 イベント送信
  data/
    events.ts     # 空配列（全データは Supabase）
    products.ts   # 特産品の静的データ
  types/index.ts  # 型定義

public/images/    # Vercel で配信する静的画像（favicon, logo, ogp など）
```

## SPEC.md の更新ルール

以下に該当する変更を行った場合は、**必ず SPEC.md の該当箇所を更新すること**。

| 変更内容 | 更新箇所 |
|---------|---------|
| 新しい画面・URLを追加 | セクション2（画面一覧） |
| 画面のセクション構成を変更 | セクション3（公開画面仕様） |
| 管理画面にタブ・機能を追加 | セクション4（管理画面仕様） |
| Supabase のキーを追加 | セクション5（データ設計） |
| 技術スタックを変更 | セクション6（インフラ・技術スタック） |
| 新しい重要なバグ・教訓が出た | BUGS.md |

更新後は Google Drive「marathon-navi バックアップ」の SPEC.md も上書きアップロードすること。

## バックアップ場所（Google Drive）

フォルダ名: 「marathon-navi バックアップ」
- SPEC.md（画面・管理画面仕様書）
- BUGS.md（バグ記録・教訓）
- scripts/（Supabase 操作用 .mjs スクリプト群）
- Excel テンプレート（大会・特産品データ入力用）
