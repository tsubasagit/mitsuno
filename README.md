# 3つの質問（mitsuno）

AIがあなたの職業に合わせて3つの質問を生成し、ワンクリックでTwitter投稿できるサービスです。

## 機能

- 職業を入力すると、AIが3つの質問を生成
- 各質問は15文字以内
- ワンクリックでTwitter投稿画面を開く
- 会員登録・ログイン不要
- レスポンシブ対応

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <your-repository-url>
cd Github-ikemori-mituno
```

### 2. OpenAI APIキーの設定

**⚠️ セキュリティに関する重要事項**

GitHub Pagesで一般公開する場合、APIキーの管理方法を慎重に選択してください。

#### 方法1: DIFY Webhookを使用（推奨・最もセキュア）⭐

DIFYのWebhookトリガーを使用することで、APIキーをクライアント側に露出させずに、ワークフローを視覚的に設計できます。

1. [DIFY](https://dify.ai/) でアカウントを作成
2. **ワークフロー**を作成し、Webhookトリガーを設定
3. プロンプトと出力ノードを設定
4. Webhook URLを取得
5. `config.js` で設定：

```javascript
window.DIFY_WEBHOOK_URL = 'https://api.dify.ai/v1/workflows/run?user=webhook&token=xxxxx';
```

**メリット**: 
- ✅ APIキーをクライアント側に露出させない（最もセキュア）
- ✅ ワークフローを視覚的に設計できる
- ✅ GitHub Pagesで公開しても安全

詳細は `DIFY_SETUP.md` を参照してください。

#### 方法2: プロキシサーバーを使用（セキュア）⭐

APIキーをクライアント側に露出させない最も安全な方法です。

1. `proxy-server/` ディレクトリのプロキシサーバーをデプロイ（Heroku、Railway、Renderなど）
2. `config.js` でプロキシサーバーのURLを設定：

```javascript
window.PROXY_SERVER_URL = 'https://your-proxy-server.herokuapp.com';
```

詳細は `proxy-server/README.md` と `SECURITY.md` を参照してください。

#### 方法3: ユーザー各自がAPIキーを入力（現在の実装）

アプリは初回起動時にユーザーにAPIキーの入力を求めます。キーはブラウザのローカルストレージに保存されます。

**メリット**: サーバー不要、実装が簡単  
**デメリット**: ユーザーがAPIキーを取得する必要がある

#### 方法4: 開発用（非推奨・本番環境では使用しない）

`config.js`ファイルで直接設定することも可能ですが、**GitHubに公開する場合は絶対に使用しないでください**：

```javascript
window.OPENAI_API_KEY = 'your-api-key-here'; // ⚠️ 絶対に公開リポジトリに含めない
```

### 3. ローカルでテスト

ファイルを直接ブラウザで開くか、ローカルサーバーを起動：

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx http-server
```

ブラウザで `http://localhost:8000` にアクセス

### 4. GitHub Pagesで公開

#### ステップ1: GitHubリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. リポジトリ名を入力（例：`mitsuno-3questions`）
4. 「Public」を選択（GitHub Pagesは無料プランでもPublicリポジトリで利用可能）
5. 「Create repository」をクリック

#### ステップ2: ローカルリポジトリをGitHubにプッシュ

```bash
# リモートリポジトリを追加（<username>と<repository-name>を実際の値に置き換え）
git remote add origin https://github.com/<username>/<repository-name>.git

# ブランチ名をmainに変更（GitHub Pagesのデフォルト設定に合わせる）
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

#### ステップ3: GitHub Pagesを有効化

1. GitHubリポジトリのページで「Settings」タブをクリック
2. 左サイドバーの「Pages」をクリック
3. 「Source」セクションで「Deploy from a branch」を選択
4. 「Branch」で「main」を選択し、「/ (root)」を選択
5. 「Save」をクリック
6. 数分待つと、`https://<username>.github.io/<repository-name>` でアクセス可能になります

**注意**: 初回デプロイには数分かかる場合があります。デプロイが完了すると、リポジトリの「Settings > Pages」に公開URLが表示されます。

## ファイル構成

- `index.html` - メインのHTMLファイル
- `style.css` - スタイリング
- `script.js` - JavaScriptロジック（OpenAI API連携、Twitter投稿）
- `config.js` - APIキー設定用
- `README.md` - このファイル

## 注意事項

- OpenAI APIの使用には料金がかかります
- APIキーは絶対に公開しないでください
- GitHub Pagesで公開する場合は、APIキーの管理方法を検討してください

## カスタマイズ

### Twitterリンクの変更

`index.html`のフッター部分を編集：

```html
<a href="https://twitter.com/your_twitter" target="_blank" rel="noopener noreferrer">Twitterリンク</a>
```

### ハッシュタグの変更

`script.js`の`openTwitterIntent`関数内の`hashtags`変数を編集：

```javascript
const hashtags = '3つの質問,ミツノ';
```

## コミットメッセージについて

⚠️ **重要**: コミットメッセージは英語で記述してください。
- 日本語のコミットメッセージは文字化けする可能性があります
- 英語のコミットメッセージを使用することで、GitHub上で正しく表示されます

### コミットメッセージの例
- ✅ `Add Twitter sharing functionality`
- ✅ `Update DIFY API configuration`
- ✅ `Fix responsive design issues`
- ❌ `Twitter共有機能を追加` (文字化けの可能性)

## ライセンス

MIT License

