# プロキシサーバー セットアップガイド

このプロキシサーバーを使用することで、OpenAI APIキーをクライアント側に露出させずに安全にAPIを呼び出すことができます。

## セットアップ手順

### 1. 依存関係のインストール

```bash
cd proxy-server
npm install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーして、APIキーを設定してください：

```bash
cp .env.example .env
```

`.env` ファイルを編集：

```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3000
ALLOWED_ORIGIN=*
```

### 3. ローカルで起動

```bash
npm start
```

開発モード（自動リロード）：

```bash
npm run dev
```

サーバーが `http://localhost:3000` で起動します。

## デプロイ方法

### Heroku

1. [Heroku](https://www.heroku.com/) にアカウント作成
2. Heroku CLIをインストール
3. 以下のコマンドを実行：

```bash
heroku create your-app-name
heroku config:set OPENAI_API_KEY=sk-your-api-key-here
git push heroku main
```

### Railway

1. [Railway](https://railway.app/) にアカウント作成
2. GitHubリポジトリを接続
3. 環境変数に `OPENAI_API_KEY` を設定
4. 自動デプロイされます

### Render

1. [Render](https://render.com/) にアカウント作成
2. 新しいWebサービスを作成
3. GitHubリポジトリを接続
4. 環境変数に `OPENAI_API_KEY` を設定
5. デプロイ

## フロントエンドの設定変更

プロキシサーバーをデプロイしたら、`script.js` のAPIエンドポイントを変更してください：

```javascript
// 変更前
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    // ...
});

// 変更後（プロキシサーバーのURLに変更）
const response = await fetch('https://your-proxy-server.herokuapp.com/api/generate-questions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ job: job })
});
```

## セキュリティ設定

本番環境では、`ALLOWED_ORIGIN` を実際のドメインに設定してください：

```
ALLOWED_ORIGIN=https://yourusername.github.io
```

これにより、指定したドメインからのみリクエストを受け付けます。

## レート制限

現在の実装では、1分間に10リクエストまでに制限されています。
本番環境では、Redis等を使用したより堅牢なレート制限を実装することを推奨します。

