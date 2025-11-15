# DIFY API 設定完了ガイド

## 設定内容

✅ DIFY APIの統合が完了しました。

### 設定値

- **APIエンドポイント**: `https://api.dify.ai/v1`
- **API Key**: `app-E9kzumkD86WEO0cgaAPtT0l8`
- **ワークフロー実行エンドポイント**: `https://api.dify.ai/v1/workflows/run`

### config.js の設定

```javascript
// DIFY API設定
window.DIFY_API_ENDPOINT = 'https://api.dify.ai/v1';
window.DIFY_API_KEY = 'app-E9kzumkD86WEO0cgaAPtT0l8';

// テストモードを無効化
window.TEST_MODE = false;
```

## リクエスト形式

フロントエンドからDIFY APIに送信されるリクエスト：

```javascript
POST https://api.dify.ai/v1/workflows/run
Headers:
  Authorization: Bearer app-E9kzumkD86WEO0cgaAPtT0l8
  Content-Type: application/json

Body:
{
  "inputs": {
    "job": "起業家"
  },
  "response_mode": "blocking",
  "user": "webhook-user-1234567890"
}
```

## レスポンス形式

DIFYのワークフローからの応答は、出力ノードの設定によって異なります。一般的には：

```json
{
  "data": {
    "output": "① 最近、心から笑ったのはいつ？\n② あなたの誇りは？\n③ 今の自分に一言言うなら？"
  },
  "event": "workflow_finished"
}
```

または

```json
{
  "output": "① 最近、心から笑ったのはいつ？\n② あなたの誇りは？\n③ 今の自分に一言言うなら？"
}
```

## 動作確認

1. `config.js` で設定が正しいか確認
2. ブラウザで `index.html` を開く
3. 職業を入力して「質問を生成する」をクリック
4. ブラウザの開発者ツール（F12）の「ネットワーク」タブでリクエストを確認

## トラブルシューティング

### エラー: "DIFY API設定が完了していません"

- `config.js` で `DIFY_API_ENDPOINT` と `DIFY_API_KEY` が設定されているか確認

### エラー: "401 Unauthorized"

- API Keyが正しいか確認
- Authorizationヘッダーが正しく設定されているか確認

### エラー: "ワークフローが見つかりません"

- ワークフローが公開されているか確認
- DIFYのワークフロー画面で「公開する」ボタンをクリック

### エラー: "入力変数が見つかりません"

- DIFYのワークフローで設定した入力変数名を確認
- フロントエンドの `inputs.job` と一致しているか確認
- 変数名が異なる場合は、`script.js` の `inputs` オブジェクトを修正

### レスポンスが空の場合

- ワークフローの出力ノードが正しく設定されているか確認
- ブラウザの開発者ツール（F12）でレスポンスの内容を確認
- `script.js` の `generateQuestionsViaDify` 関数で、実際のレスポンス形式に合わせて調整

## セキュリティに関する注意事項

⚠️ **重要**: API Keyが `config.js` に直接記載されています。

### 本番環境での推奨事項

1. **プロキシサーバー経由で使用**（推奨）
   - API Keyをサーバー側で管理
   - クライアント側にAPI Keyを露出させない

2. **GitHubに公開する場合**
   - `config.js` からAPI Keyを削除
   - 環境変数や別の設定ファイルで管理
   - `.gitignore` に `config.js` を追加

3. **API Keyのローテーション**
   - 定期的にAPI Keyを変更
   - 漏洩が疑われる場合は即座に変更

## 参考リンク

- DIFY公式ドキュメント: https://docs.dify.ai/
- アプリURL: https://cloud.dify.ai/app/07cea91a-5ea7-45e6-a464-742bc073c106/workflow
- 開発者ページ: https://cloud.dify.ai/app/07cea91a-5ea7-45e6-a464-742bc073c106/develop

