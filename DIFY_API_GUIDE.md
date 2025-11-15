# DIFY API 統合ガイド

アプリID: `app-E9kzumkD86WEO0cgaAPtT0l8`  
開発者ページ: https://cloud.dify.ai/app/07cea91a-5ea7-45e6-a464-742bc073c106/develop

## DIFYの開発者ページで確認すべき情報

`/develop` ページには以下の情報が表示されています：

1. **APIエンドポイント** - Webhook URLの形式
2. **API Key** - 認証に使用するキー
3. **リクエスト形式** - 送信するデータの形式
4. **レスポンス形式** - 受け取るデータの形式
5. **サンプルコード** - 実装例

## Webhook URLの取得方法

### ステップ1: 開発者ページを確認

1. https://cloud.dify.ai/app/07cea91a-5ea7-45e6-a464-742bc073c106/develop にアクセス
2. 表示されている「APIエンドポイント」または「Webhook URL」を確認
3. 「API Key」を確認

### ステップ2: Webhook URLの形式

DIFY Cloudの場合、通常は以下のいずれかの形式です：

**形式1（推奨）:**
```
https://cloud.dify.ai/api/v1/workflows/run?user=webhook&token=YOUR_API_KEY
```

**形式2:**
```
https://api.dify.ai/v1/workflows/run?app_id=app-E9kzumkD86WEO0cgaAPtT0l8&token=YOUR_API_KEY
```

**形式3（DIFYの開発者ページに表示されている形式）:**
```
https://cloud.dify.ai/api/v1/apps/{app_id}/workflows/{workflow_id}/trigger?api_key={api_key}
```

### ステップ3: config.js に設定

```javascript
// テストモードを無効化
window.TEST_MODE = false;

// DIFY Webhook URLを設定（開発者ページから取得したURL）
window.DIFY_WEBHOOK_URL = '開発者ページに表示されているAPIエンドポイント';
```

## リクエスト形式

DIFYの開発者ページに記載されているリクエスト形式に従います。一般的には：

```json
{
  "inputs": {
    "job": "起業家"
  },
  "user": "webhook-user-1234567890",
  "response_mode": "blocking"
}
```

## レスポンス形式

DIFYのワークフローからの応答は、出力ノードの設定によって異なります。一般的には：

```json
{
  "output": "① 最近、心から笑ったのはいつ？\n② あなたの誇りは？\n③ 今の自分に一言言うなら？"
}
```

または

```json
{
  "result": "...",
  "data": {
    "output": "..."
  }
}
```

## 実装の確認ポイント

1. **ワークフローの「開始」ノード**で「Webhook」トリガーが設定されているか
2. **入力変数名**が `job` になっているか（DIFYのワークフローで設定した変数名と一致させる）
3. **ワークフローが公開されているか**（「公開する」ボタンをクリック）
4. **API Keyが正しく設定されているか**

## トラブルシューティング

### エラー: "APIキーが無効です"

- 開発者ページでAPI Keyを再確認
- API Keyが正しくURLに含まれているか確認

### エラー: "ワークフローが見つかりません"

- ワークフローが公開されているか確認
- アプリIDが正しいか確認

### エラー: "入力変数が見つかりません"

- DIFYのワークフローで設定した入力変数名を確認
- フロントエンドの `inputs` オブジェクトのキー名と一致しているか確認

### レスポンスが空の場合

- ワークフローの出力ノードが正しく設定されているか確認
- ブラウザの開発者ツール（F12）でレスポンスの内容を確認
- `script.js` の `generateQuestionsViaDify` 関数で、実際のレスポンス形式に合わせて調整

## 次のステップ

1. 開発者ページ（`/develop`）でAPIエンドポイントとAPI Keyを確認
2. `config.js` にWebhook URLを設定
3. `TEST_MODE = false` に設定
4. ブラウザで動作確認
5. エラーが発生する場合は、ブラウザの開発者ツール（F12）でネットワークタブを確認

## 参考リンク

- DIFY公式ドキュメント: https://docs.dify.ai/
- アプリURL: https://cloud.dify.ai/app/07cea91a-5ea7-45e6-a464-742bc073c106/workflow
- 開発者ページ: https://cloud.dify.ai/app/07cea91a-5ea7-45e6-a464-742bc073c106/develop

