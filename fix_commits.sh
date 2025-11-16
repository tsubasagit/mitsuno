#!/bin/bash
# コミットメッセージを修正するbashスクリプト

git filter-branch -f --msg-filter '
case "$GIT_COMMIT" in
    90930e6fd2dec91acb44c6a88a8c5b7e68574f31)
        echo "説明書の使用モデルをgpt-4oに更新"
        ;;
    6173a9a85b46344d5283dec1b2e5ff2703338464)
        echo "クライアント向け説明書にOpenAI API設定情報を追加"
        ;;
    ff6bcb38b6cf3d8a84bcd077582d3197df97a77c)
        echo "DIFY API Keyを更新"
        ;;
    95a223973eafb128f375e82f75b3eb407bf8e53a)
        echo "タイトルとフッターを更新: 3つの質問に変更、運営者情報を更新"
        ;;
    9328f70441f8619c70fa27eee0cb7f5bea88605d)
        echo "Twitter投稿機能を改善: 新規タブで開く、#ミツノ削除、URL変更、質問に冒頭テキスト追加"
        ;;
    bbf4835a24349bf9d1a37d69001fc228c0ec917e)
        echo "プレースホルダーに複数の例を追加"
        ;;
    94977bad7639812394697fad1355d24d8f90303e)
        echo "入力フォームのラベルを「あなたの立場を教えてください」に変更"
        ;;
    08a5c694a5ccb78cc3794b18069d0a3cfeea4fd2)
        echo "OpenAI APIキー関連の機能を削除: DIFY APIへの移行"
        ;;
    61125960ca238019130764b1e72142654a9108e7)
        echo "config.jsを.gitignoreから削除（学習用として公開）"
        ;;
    *)
        cat
        ;;
esac
' -- --all
