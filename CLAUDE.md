# atlas — コーヒーで世界を旅する

コーヒーのテイスティング体験を 1 冊の地図帳に綴じる Web アプリ。SCA フレーバーホイールでの風味記録、産地マップ、公開 URL によるシェア。

## 重要

- **`DESIGN_BRIEF.md` がデザイン判断の唯一の根拠**。実装で迷ったら必ず開く
- **`prototype/home.html` がトーン基準**。Next.js 実装はこのトーンを再現したものでなければならない
- 「Notion×シンプル」「素 SaaS テンプレ」に戻ることを最大の失敗とする ([[feedback-design-promise-delivery-gap]] 参照)

## 技術スタック

- **Framework**: Next.js 16.2.7 (App Router) — `node_modules/next/dist/docs/` を参照
- **Language**: TypeScript / React 19.2
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui (Radix + Nova preset, Lucide icons)
- **Fonts**: Fraunces (見出し serif) + Inter + Caveat (手書きアクセント) + Noto Sans JP (next/font)
- **手描き感**: roughjs (rough.svg) — UI の枠線・下線のゆらぎ
- **DB**: Neon Postgres + Prisma (Task #12 で導入)
- **Auth**: Auth.js v5 + Google OAuth (Task #12 で導入)
- **画像**: Vercel Blob (Task #12 で導入)
- **植物識別→コーヒー識別はしない**。OCR or 手入力中心
- **Deploy**: Vercel Hobby (非商用ポートフォリオ)
- **Package Manager**: pnpm

## ディレクトリ規約

- `src/app/` — ルート (App Router)
- `src/components/ui/` — shadcn コンポーネント
- `src/components/decorations/` — 手描き要素 (rough.js) クライアントコンポーネント
- `src/components/marks/` — 自前 SVG (コンパス、地図、ピン等) — 必要に応じて分割
- `src/lib/` — Prisma、Pl@ntNet 置き換え (識別不要)、Blob 等
- `prisma/` — DB schema (Task #12)

## コマンド

- `pnpm dev` — 開発サーバー
- `pnpm build` — 本番ビルド
- `pnpm lint` — ESLint

## デザイン規約 (Design Brief の要約)

- カラーパレット: 古紙アイボリー + 焙煎ブラウン + コーヒーチェリー赤 + 生豆グリーン
- フォント: 見出し Fraunces (serif), 本文 Inter + Noto Sans JP, アクセント Caveat
- 手描き要素: rough.js で枠線・下線、自前 Excalidraw 風 SVG で装飾
- トーン: 紀行文・旅日記の温度。「ぜひ」「無料登録」等の SaaS 売り込み語は禁止
- アンチパターン: 絵文字をアイコン代わりに、ガラスモーフィズム、ネオン、Web3 風

## 禁止事項

- コストが発生する操作 (有料 SaaS、独自ドメイン購入等) はユーザー確認なしに実行しない
- emoji をアイコンとして使わない (Lucide / 自前 SVG)
- shadcn 素テンプレで満足しない。世界観を必ず CSS と SVG に焼き込む
- DESIGN_BRIEF.md に違反する実装をマージしない

## Next.js 16 メモ

- 破壊的変更あり。新 API を使う前に `node_modules/next/dist/docs/01-app/` の該当ガイドを読む
- App Router + RSC が前提、サーバーコンポーネント基本
- rough.js 等のブラウザ依存ライブラリは "use client" のクライアントコンポーネントに分離
