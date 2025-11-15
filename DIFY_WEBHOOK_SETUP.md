# DIFY Webhook URL 設定ガイド

アプリID: `app-E9kzumkD86WEO0cgaAPtT0l8`

## Webhook URLの取得方法

### 方法1: DIFYの「API アクセス」タブで直接取得（最も簡単）⭐

1. DIFYのワークフロー画面で、左サイドバーの「API アクセス」（鍵アイコン）をクリック
2. 「Webhook URL」または「API Endpoint」セクションを確認
3. 表示されたURLをコピー
4. `config.js` の `window.DIFY_WEBHOOK_URL` に貼り付け

### 方法2: API KeyとアプリIDから構築

「API アクセス」タブまたは「開発」ページでAPI Keyを確認し、以下の形式で構築：

**DIFY Cloudの場合：**
```
https://cloud.dify.ai/api/v1/workflows/run?user=webhook&token=YOUR_API_KEY
```

または

```
https://api.dify.ai/v1/workflows/run?app_id=app-E9kzumkD86WEO0cgaAPtT0l8&token=YOUR_API_KEY
```

**注意**: `/develop` ページに表示されているAPIエンドポイントをそのまま使用することを推奨します。

## 設定手順

### 1. config.js を編集

```javascript
// テストモードを無効化
window.TEST_MODE = false;

// DIFY Webhook URLを設定
window.DIFY_WEBHOOK_URL = '取得したWebhook URLをここに貼り付け';
```

### 2. ワークフローの確認

DIFYのワークフローで以下を確認：

1. **「開始」ノード**で「Webhook」トリガーが設定されているか
2. **入力変数**として `job` が設定されているか（変数名は任意）
3. **ワークフローが公開されているか**（「公開する」ボタンをクリック）

### 3. リクエスト形式の確認

フロントエンドから送信されるリクエスト形式：

```json
{
  "inputs": {
    "job": "起業家"
  },
  "user": "webhook-user-1234567890"
}
```

DIFYのワークフローで設定した入力変数名（例：`job`）と一致しているか確認してください。

## テスト方法

1. `config.js` にWebhook URLを設定
2. `TEST_MODE = false` に設定
3. ブラウザで `index.html` を開く
4. 職業を入力して「質問を生成する」をクリック
5. ブラウザの開発者ツール（F12）の「ネットワーク」タブでリクエストを確認

## トラブルシューティング

### Webhook URLが見つからない場合

1. 「API アクセス」タブで「API Key」を確認
2. 上記の「方法2」でURLを構築
3. または、DIFYのサポートに問い合わせ

### エラーが発生する場合

1. ワークフローが公開されているか確認
2. 「開始」ノードで「Webhook」トリガーが設定されているか確認
3. 入力変数名が正しいか確認（フロントエンドの `inputs.job` と一致しているか）
4. ブラウザの開発者ツール（F12）でエラーメッセージを確認

## 参考

- DIFY公式ドキュメント: https://docs.dify.ai/
- アプリURL: https://cloud.dify.ai/app/07cea91a-5ea7-45e6-a464-742bc073c106/workflow

