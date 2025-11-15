// テストモードかどうかを確認
function isTestMode() {
    return window.TEST_MODE === true;
}

// OpenAI APIキー関連の機能は削除しました（DIFY APIを使用するため不要）

// モックデータを生成（テストモード用）
function generateMockQuestions(job) {
    // 職業に応じたサンプル質問を返す
    const mockQuestionsByJob = {
        '起業家': ['最近、心から笑ったのはいつ？', 'あなたの誇りは？', '今の自分に一言言うなら？'],
        '学生': ['最近、心から笑ったのはいつ？', 'あなたの誇りは？', '今の自分に一言言うなら？'],
        'デザイナー': ['最近、心から笑ったのはいつ？', 'あなたの誇りは？', '今の自分に一言言うなら？'],
        'エンジニア': ['最近、心から笑ったのはいつ？', 'あなたの誇りは？', '今の自分に一言言うなら？'],
        '教師': ['最近、心から笑ったのはいつ？', 'あなたの誇りは？', '今の自分に一言言うなら？'],
        '医師': ['最近、心から笑ったのはいつ？', 'あなたの誇りは？', '今の自分に一言言うなら？'],
    };
    
    // 職業に応じた質問があればそれを使用、なければデフォルト
    const questions = mockQuestionsByJob[job] || [
        '最近、心から笑ったのはいつ？',
        'あなたの誇りは？',
        '今の自分に一言言うなら？'
    ];
    
    // 少し遅延を入れてAPI呼び出しをシミュレート
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(questions);
        }, 1000); // 1秒の遅延
    });
}

// プロキシサーバーを使用するかどうかを確認
function useProxyServer() {
    return window.PROXY_SERVER_URL && window.PROXY_SERVER_URL.trim().length > 0;
}

// DIFY APIを使用するかどうかを確認
function useDify() {
    return window.DIFY_API_ENDPOINT && window.DIFY_API_ENDPOINT.trim().length > 0 
        && window.DIFY_API_KEY && window.DIFY_API_KEY.trim().length > 0;
}

// プロキシサーバー経由で質問を生成
async function generateQuestionsViaProxy(job) {
    const proxyUrl = window.PROXY_SERVER_URL;
    
    try {
        const response = await fetch(`${proxyUrl}/api/generate-questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ job })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'APIリクエストに失敗しました');
        }

        const data = await response.json();
        return data.questions;
    } catch (error) {
        console.error('Proxy Error:', error);
        throw error;
    }
}

// DIFY APIを使用して質問を生成
async function generateQuestionsViaDify(job) {
    const apiEndpoint = window.DIFY_API_ENDPOINT;
    const apiKey = window.DIFY_API_KEY;
    
    if (!apiEndpoint || !apiKey) {
        throw new Error('DIFY API設定が完了していません。config.jsでDIFY_API_ENDPOINTとDIFY_API_KEYを設定してください。');
    }

    // DIFYのワークフロー実行エンドポイント
    const workflowUrl = `${apiEndpoint}/workflows/run`;

    // リクエストボディを構築
    const requestBody = {
        // DIFYのワークフローで設定した入力変数名に合わせて調整してください
        // 変数名が 'job' の場合: inputs: { job: job }
        // 変数名が異なる場合は、ここを修正してください
        inputs: {
            job: job
        },
        // response_mode: 'blocking' で同期レスポンスを取得
        // 'streaming' の場合はストリーミングレスポンスになります
        response_mode: 'blocking',
        // ユーザーID（任意）
        user: 'webhook-user-' + Date.now()
    };

    // デバッグ: リクエスト内容をログに出力
    console.log('DIFY API リクエスト URL:', workflowUrl);
    console.log('DIFY API リクエスト Body:', JSON.stringify(requestBody, null, 2));
    console.log('送信する変数名:', 'job');
    console.log('送信する値:', job);

    try {
        // DIFYのAPIにリクエストを送信
        // DIFYのAPIドキュメント（/develop ページ）に記載されている形式に従います
        // AuthorizationヘッダーでBearerトークンを使用
        const response = await fetch(workflowUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('DIFY API エラーレスポンス:', errorText);
            console.error('ステータスコード:', response.status);
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText };
            }
            throw new Error(errorData.message || errorData.error || `DIFY APIリクエストに失敗しました (ステータス: ${response.status})`);
        }

        const data = await response.json();
        
        // デバッグ: レスポンス全体をログに出力
        console.log('DIFY API レスポンス:', data);
        
        // DIFYのワークフローからの応答形式に応じて調整
        // 実際のレスポンス形式: { "data": { "outputs": { "質問1": "...", "質問2": "...", "質問3": "..." } } }
        let questions = [];
        
        // 応答形式のパターン1: data.data.outputs オブジェクト形式（現在のDIFYの形式）
        if (data.data && data.data.outputs && typeof data.data.outputs === 'object') {
            // outputsオブジェクトから質問を抽出
            // キー名が "質問1", "質問2", "質問3" などの形式
            const outputs = data.data.outputs;
            
            // キーをソートして順番に取得（質問1, 質問2, 質問3 の順）
            const sortedKeys = Object.keys(outputs).sort((a, b) => {
                // 数字部分を抽出して比較
                const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                return numA - numB;
            });
            
            questions = sortedKeys
                .map(key => {
                    const question = outputs[key];
                    if (typeof question === 'string' && question.trim().length > 0) {
                        return question.trim();
                    }
                    return null;
                })
                .filter(q => q !== null)
                .slice(0, 3);
        }
        // 応答形式のパターン2: data.data.output (文字列形式)
        else if (data.data && data.data.output) {
            const content = typeof data.data.output === 'string' 
                ? data.data.output 
                : JSON.stringify(data.data.output);
            
            // 質問を抽出（番号付きリストから）
            questions = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => {
                    // 番号や記号を除去
                    return line
                        .replace(/^[①-⑨0-9]+[\.、）)]?\s*/, '')
                        .replace(/^[・\-]\s*/, '')
                        .replace(/^[0-9]+[\.\)）]\s*/, '')
                        .trim();
                })
                .filter(q => q.length > 0 && q.length <= 20)
                .slice(0, 3);
        }
        // 応答形式のパターン3: data.output
        else if (data.output) {
            const content = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
            questions = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => {
                    return line
                        .replace(/^[①-⑨0-9]+[\.、）)]?\s*/, '')
                        .replace(/^[・\-]\s*/, '')
                        .replace(/^[0-9]+[\.\)）]\s*/, '')
                        .trim();
                })
                .filter(q => q.length > 0 && q.length <= 20)
                .slice(0, 3);
        }
        // その他の形式
        else {
            console.warn('DIFY応答データ（全体）:', JSON.stringify(data, null, 2));
            console.warn('DIFY応答データ（構造）:', Object.keys(data));
            throw new Error('DIFYからの応答形式が認識できませんでした。ワークフローの出力設定を確認してください。');
        }

        // デバッグ: 抽出された質問をログに出力
        console.log('抽出された質問:', questions);
        console.log('質問の数:', questions.length);

        if (questions.length === 0) {
            console.error('質問の抽出に失敗しました。レスポンスデータ:', JSON.stringify(data, null, 2));
            throw new Error('質問の生成に失敗しました。もう一度お試しください。');
        }

        return questions;
    } catch (error) {
        console.error('Dify API Error:', error);
        throw error;
    }
}

// OpenAI APIを使用して質問を生成
async function generateQuestions(job) {
    // テストモードの場合はモックデータを返す
    if (isTestMode()) {
        console.log('テストモード: モックデータを使用します');
        return await generateMockQuestions(job);
    }
    
    // プロキシサーバーを使用する場合
    if (useProxyServer()) {
        console.log('プロキシサーバー経由でAPIを呼び出します');
        return await generateQuestionsViaProxy(job);
    }
    
    // DIFY APIを使用する場合
    if (useDify()) {
        console.log('DIFY APIを使用します');
        return await generateQuestionsViaDify(job);
    }
    
    // DIFY APIが設定されていない場合のエラー
    throw new Error('DIFY APIが設定されていません。config.jsでDIFY_API_ENDPOINTとDIFY_API_KEYを設定してください。');
}

// 質問を表示
function displayQuestions(questions) {
    const questionsSection = document.getElementById('questionsSection');
    const questionsList = document.getElementById('questionsList');
    
    questionsList.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        
        const numberMap = ['①', '②', '③'];
        const questionNumber = document.createElement('div');
        questionNumber.className = 'question-number';
        questionNumber.textContent = numberMap[index];
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = question;
        
        const tweetBtn = document.createElement('button');
        tweetBtn.className = 'tweet-btn';
        tweetBtn.textContent = 'この質問に回答する';
        tweetBtn.onclick = () => openTwitterIntent(question);
        
        // オプション: コピーボタンを追加（必要に応じて）
        // const copyBtn = document.createElement('button');
        // copyBtn.className = 'copy-btn';
        // copyBtn.textContent = 'テキストをコピー';
        // copyBtn.onclick = async () => {
        //     const hashtags = '3つの質問,ミツノ';
        //     const url = window.location.href;
        //     const hashtagText = hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ');
        //     const text = `${question}\n\n${hashtagText} ${url}`;
        //     const success = await copyToClipboard(text);
        //     if (success) {
        //         alert('テキストをクリップボードにコピーしました！');
        //     } else {
        //         alert('コピーに失敗しました。手動でコピーしてください。');
        //     }
        // };
        // questionItem.appendChild(copyBtn);
        
        questionItem.appendChild(questionNumber);
        questionItem.appendChild(questionText);
        questionItem.appendChild(tweetBtn);
        
        questionsList.appendChild(questionItem);
    });
    
    questionsSection.style.display = 'block';
    questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Twitter（X）投稿画面を開く
function openTwitterIntent(question) {
    const hashtags = '3つの質問';
    // GitHub PagesのURLを使用
    const url = 'https://tsubasagit.github.io/mitsuno/';
    
    // テキストを構築（Twitterの文字数制限280文字を考慮）
    // 「あなたへの質問：」を冒頭に追加
    const hashtagText = `#${hashtags}`;
    let text = `あなたへの質問：${question}\n\n${hashtagText}`;
    
    // URLを追加（文字数制限を考慮）
    const maxLength = 280;
    const urlWithSpace = ` ${url}`;
    if (text.length + urlWithSpace.length <= maxLength) {
        text += urlWithSpace;
    }
    
    // X（Twitter）のIntent URLを使用
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
    
    // 新規タブで開く
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
}

// テキストをクリップボードにコピーする関数（オプション）
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // フォールバック: 古い方法を使用
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// エラーを表示
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// ページ読み込み時の初期化
window.addEventListener('DOMContentLoaded', () => {
    // テストモードの場合はモックデータを使用
    if (isTestMode()) {
        console.log('テストモードが有効です。モックデータを使用します。');
        return;
    }
    
    // プロキシサーバーを使用する場合
    if (useProxyServer()) {
        console.log('プロキシサーバーが設定されています。');
        return;
    }
    
    // DIFY APIを使用する場合
    if (useDify()) {
        console.log('DIFY APIが設定されています。');
        return;
    }
    
    // DIFY APIが設定されていない場合の警告
    console.warn('DIFY APIが設定されていません。config.jsでDIFY_API_ENDPOINTとDIFY_API_KEYを設定してください。');
});

// フォーム送信処理
document.getElementById('jobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const jobInput = document.getElementById('jobInput');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const questionsSection = document.getElementById('questionsSection');
    const errorDiv = document.getElementById('error');
    
    const job = jobInput.value.trim();
    
    if (!job) {
        showError('職業を入力してください。');
        return;
    }
    
    // UI状態を更新
    generateBtn.disabled = true;
    loading.style.display = 'block';
    questionsSection.style.display = 'none';
    errorDiv.style.display = 'none';
    
    try {
        const questions = await generateQuestions(job);
        displayQuestions(questions);
    } catch (error) {
        showError(error.message || '質問の生成に失敗しました。もう一度お試しください。');
    } finally {
        generateBtn.disabled = false;
        loading.style.display = 'none';
    }
});

