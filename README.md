# atlas

> コーヒーは世界を旅する。あなたのカップで、もう一度。

飲んだコーヒーを 1 杯ずつカルテにして、地図帳のように綴じていく Web アプリです。

**🌐 ライブ**: https://atlas-eight-mauve.vercel.app

## できること

- 飲んだコーヒーを「カルテ」として記録（産地・焙煎度・抽出方法・味）
- **SCA フレーバーホイール**で風味を視覚的にマップ（デスクトップは円形 SVG、モバイルはアコーディオン）
- カルテごとに公開 URL が発行され、SNS にそのまま貼れる
- 共有時の OG プレビューは Fraunces セリフ + コンパス装飾 + 紀行文トーンで動的生成
- 各カルテに **FLUX.1-schnell** で生成された水彩イラストが添えられる（産地・焙煎度・風味からプロンプト合成）
- 編集・削除・複数カルテ管理（マイ図書館）

## 世界観

古地図・紀行文・コンパスローズをモチーフに、見出しは [Fraunces](https://fonts.google.com/specimen/Fraunces) のセリフ、アクセントは [Caveat](https://fonts.google.com/specimen/Caveat) の手書き、配色は古紙アイボリーと焙煎ブラウン。手描き感は [rough.js](https://roughjs.com/) と Excalidraw 風の自前 SVG で。

判断の根拠は [`DESIGN_BRIEF.md`](./DESIGN_BRIEF.md) に、トーン基準は [`prototype/home.html`](./prototype/home.html) に置いています。

## 技術スタック

| 領域 | 採用 |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind v4 + shadcn/ui (Radix + Nova preset) |
| Fonts | Fraunces / Inter / Caveat / Noto Sans JP (next/font) |
| DB | Postgres (Neon free tier) + Prisma |
| 認証 | Auth.js v5 + Google OAuth |
| 画像生成 | Hugging Face Inference (FLUX.1-schnell) を `/api/coffee/[id]/image` でプロキシ + Vercel Edge キャッシュ |
| 手描き感 | roughjs |
| Deploy | Vercel Hobby |

## ローカルで動かす

```bash
pnpm install
cp .env.example .env
# .env に DATABASE_URL / AUTH_SECRET / AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET /
# HUGGINGFACE_TOKEN を埋める
pnpm exec prisma migrate dev
pnpm dev
```

`http://localhost:3000` でアプリが起動します。

## ディレクトリ概観

```
src/
  app/
    page.tsx                          ホーム
    login/                            Google OAuth サインイン
    my/                               マイ図書館
    new/                              カルテ作成
    coffee/[id]/
      page.tsx                        詳細
      edit/                           編集・削除
      opengraph-image.tsx             動的 OG 画像
    api/coffee/[id]/image/route.ts    FLUX.1-schnell プロキシ
    flavor-wheel/                     フレーバーホイール プレビュー
  components/
    flavor-wheel/                     SCA ホイール (desktop SVG + mobile list)
    forms/coffee-form.tsx             カルテ CRUD 共通フォーム
    decorations/                      rough.js 手描き要素
    site-header.tsx                   認証状態を反映するヘッダー
  lib/
    auth.ts                           Auth.js v5 設定
    db.ts                             Prisma クライアント (singleton)
    coffee-image.ts                   水彩プロンプトビルダー
    flavor-wheel.ts                   SCA タクソノミー + ジオメトリ
prisma/
  schema.prisma
  migrations/
prototype/home.html                   Next.js 化前のトーン基準
DESIGN_BRIEF.md                       デザイン判断の単一根拠
scripts/verify-new.mjs                Playwright で /new を E2E 検証
```

## 検証

```bash
# Playwright で /new フォームをエンドツーエンド検証 (要 chromium)
node scripts/verify-new.mjs
```

DB に直接 Session 行を差し込んで認証バイパスし、フォーム入力 → 保存 → `/coffee/[id]` への遷移までを検査します。

## 開発状況

個人開発の習作 / ポートフォリオ作品として運用中。SNS 化（他の人のテイスティングを見る、フォロー）は将来検討。
