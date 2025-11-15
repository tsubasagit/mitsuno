// OpenAI APIキーの設定（オプション）
// 注意: このファイルをGitHubに公開する場合は、APIキーを直接書かないでください
// 
// アプリは初回起動時にユーザーにAPIキーの入力を求めます。
// キーはブラウザのローカルストレージに保存されます。
//
// 開発用に直接設定する場合は、以下のコメントを外してください：
// window.OPENAI_API_KEY = 'your-api-key-here';

// テストモード: trueにすると、APIキー入力なしでモックデータを使用します
// DIFY APIを使用する場合は false に設定してください
window.TEST_MODE = false;

// プロキシサーバーのURL（本番環境でプロキシサーバーを使用する場合）
// 例: window.PROXY_SERVER_URL = 'https://your-proxy-server.herokuapp.com';
// 設定しない場合は、ユーザー各自がAPIキーを入力する方式になります
window.PROXY_SERVER_URL = '';

// DIFY API設定（DIFYを使用する場合）
// DIFYのAPIエンドポイントとAPI Keyを設定します
// エンドポイント: https://api.dify.ai/v1
// API Key: app-E9kzumkD86WEO0cgaAPtT0l8
//
// ⚠️ 注意: API Keyをクライアント側に露出させない方が安全です
// 本番環境では、プロキシサーバー経由で使用することを推奨します
window.DIFY_API_ENDPOINT = 'https://api.dify.ai/v1';
window.DIFY_API_KEY = 'app-E9kzumkD86WEO0cgaAPtT0l8';

// OpenAI APIキーの設定（開発用、またはプロキシサーバーを使用しない場合）
// 注意: GitHubに公開する場合は、APIキーを直接書かないでください
window.OPENAI_API_KEY = '';

