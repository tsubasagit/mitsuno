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

アプリは初回起動時にユーザーにAPIキーの入力を求めます。キーはブラウザのローカルストレージに保存されます。

**開発用**: `config.js`ファイルで直接設定することも可能です（GitHubに公開する場合は非推奨）：

```javascript
window.OPENAI_API_KEY = 'your-api-key-here';
```

**本番環境**: ユーザーが各自のAPIキーを入力する方式のため、GitHubに公開しても安全です。

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

1. GitHubリポジトリにプッシュ
2. リポジトリのSettings > Pagesに移動
3. Sourceを「main」ブランチ（または使用しているブランチ）に設定
4. 保存後、数分で `https://<username>.github.io/<repository-name>` でアクセス可能

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

## ライセンス

MIT License

