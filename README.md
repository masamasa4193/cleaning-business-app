# ワークス-S Threads投稿自動生成ツール

エアコンクリーニング専用のThreads投稿をAIで自動生成するNext.jsアプリケーション

## 機能

- ✅ 季節・目的・トーン選択による投稿生成
- ✅ AI による3パターン自動生成
- ✅ 文字数カウンター（500文字警告付き）
- ✅ ハッシュタグ自動生成・コピー
- ✅ 投稿履歴の保存（localStorage）
- ✅ 投稿スケジュール管理
- ✅ 投稿分析ダッシュボード
- ✅ エクスポート機能（テキストファイル）
- ✅ 画像生成プロンプト自動作成

## Vercelへのデプロイ方法

### 1. GitHubリポジトリを作成

```bash
cd cleaning-business-app
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Vercelでデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. 「Deploy」をクリック

### 3. 環境変数の設定（不要）

このアプリはAPIキーを使用しないため、環境変数の設定は不要です。

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 本番ビルド

```bash
npm run build
npm start
```

## 技術スタック

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (アイコン)
- Claude API (Anthropic)

## ライセンス

MIT
