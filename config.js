// DIFY API設定
// 学習用として、DIFY API KeyをGitHubに公開しています
// DIFY側で制限をかけているため、学習目的での使用に限定されています
//
// DIFYのAPIエンドポイントとAPI Keyを設定します
// エンドポイント: https://api.dify.ai/v1
// API Key: app-E9kzumkD86WEO0cgaAPtT0l8
window.DIFY_API_ENDPOINT = 'https://api.dify.ai/v1';
window.DIFY_API_KEY = 'app-E9kzumkD86WEO0cgaAPtT0l8';

// テストモード: trueにすると、APIキー入力なしでモックデータを使用します
// DIFY APIを使用する場合は false に設定してください
window.TEST_MODE = false;

// プロキシサーバーのURL（本番環境でプロキシサーバーを使用する場合）
// 例: window.PROXY_SERVER_URL = 'https://your-proxy-server.herokuapp.com';
window.PROXY_SERVER_URL = '';

