// APIキーを取得（ローカルストレージまたはconfig.jsから）
function getApiKey() {
    // まずローカルストレージを確認
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
        return storedKey;
    }
    // 次にconfig.jsから取得を試みる
    if (window.OPENAI_API_KEY) {
        return window.OPENAI_API_KEY;
    }
    return null;
}

// APIキーを保存
function saveApiKey(apiKey) {
    localStorage.setItem('openai_api_key', apiKey);
}

// APIキーモーダルを表示
function showApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    modal.style.display = 'flex';
}

// APIキーモーダルを非表示
function hideApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    modal.style.display = 'none';
}

// OpenAI APIを使用して質問を生成
async function generateQuestions(job) {
    const apiKey = getApiKey();
    
    if (!apiKey) {
        showApiKeyModal();
        throw new Error('OpenAI APIキーを入力してください。');
    }

    const prompt = `あなたは質問生成の専門家です。${job}という職業の人に対して、以下の条件を満たす3つの質問を生成してください：

1. 各質問は15文字以内であること
2. その職業の人にとって興味深く、答えやすい質問であること
3. Twitterでシェアしたくなるような質問であること
4. 承認欲求を満たすような質問であること

質問は番号付きリストで出力してください。各質問は改行で区切ってください。説明文や余計なテキストは不要です。`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたは質問生成の専門家です。簡潔で興味深い質問を生成してください。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 200,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'APIリクエストに失敗しました');
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // 質問を抽出（番号付きリストから）
        const questions = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // 番号や記号を除去
                return line.replace(/^[①-⑨0-9]+[\.、）)]?\s*/, '').replace(/^[・\-]\s*/, '');
            })
            .filter(q => q.length > 0 && q.length <= 20) // 15文字以内を緩和して20文字まで
            .slice(0, 3); // 最大3つまで

        if (questions.length === 0) {
            throw new Error('質問の生成に失敗しました。もう一度お試しください。');
        }

        return questions;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
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
        
        questionItem.appendChild(questionNumber);
        questionItem.appendChild(questionText);
        questionItem.appendChild(tweetBtn);
        
        questionsList.appendChild(questionItem);
    });
    
    questionsSection.style.display = 'block';
    questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Twitter投稿画面を開く
function openTwitterIntent(question) {
    const hashtags = '3つの質問,ミツノ';
    const url = window.location.href;
    const text = `${question}\n\n#${hashtags.replace(/,/g, ' #')} ${url}`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
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

// APIキー保存処理
document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showError('APIキーを入力してください。');
        return;
    }
    
    if (!apiKey.startsWith('sk-')) {
        showError('有効なOpenAI APIキーを入力してください。');
        return;
    }
    
    saveApiKey(apiKey);
    hideApiKeyModal();
    apiKeyInput.value = '';
});

// ページ読み込み時にAPIキーをチェック
window.addEventListener('DOMContentLoaded', () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        // config.jsからも取得を試みる
        setTimeout(() => {
            const configKey = getApiKey();
            if (!configKey) {
                showApiKeyModal();
            }
        }, 100);
    }
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

