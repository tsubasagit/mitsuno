// OpenAI API プロキシサーバー
// このサーバーを経由することで、APIキーをクライアント側に露出させずに済みます

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS設定（本番環境では適切なオリジンを指定してください）
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    credentials: true
}));

app.use(express.json());

// レート制限用の簡易実装（本番環境ではRedis等を使用することを推奨）
const rateLimitMap = new Map();
const RATE_LIMIT = {
    maxRequests: 10, // 1分間に10リクエストまで
    windowMs: 60 * 1000 // 1分
};

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    
    // 1分以上前のリクエストを削除
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT.windowMs);
    
    if (recentRequests.length >= RATE_LIMIT.maxRequests) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

// OpenAI APIへのプロキシエンドポイント
app.post('/api/generate-questions', async (req, res) => {
    try {
        // レート制限チェック
        const clientIp = req.ip || req.connection.remoteAddress;
        if (!checkRateLimit(clientIp)) {
            return res.status(429).json({ 
                error: 'リクエストが多すぎます。しばらく待ってから再度お試しください。' 
            });
        }

        const { job } = req.body;

        if (!job || typeof job !== 'string' || job.trim().length === 0) {
            return res.status(400).json({ error: '職業を入力してください。' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEYが環境変数に設定されていません');
            return res.status(500).json({ error: 'サーバー設定エラー' });
        }

        const prompt = `あなたは質問生成の専門家です。${job}という職業の人に対して、以下の条件を満たす3つの質問を生成してください：

1. 各質問は15文字以内であること
2. その職業の人にとって興味深く、答えやすい質問であること
3. Twitterでシェアしたくなるような質問であること
4. 承認欲求を満たすような質問であること

質問は番号付きリストで出力してください。各質問は改行で区切ってください。説明文や余計なテキストは不要です。`;

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
            console.error('OpenAI API Error:', errorData);
            return res.status(response.status).json({ 
                error: errorData.error?.message || 'APIリクエストに失敗しました' 
            });
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // 質問を抽出
        const questions = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                return line.replace(/^[①-⑨0-9]+[\.、）)]?\s*/, '').replace(/^[・\-]\s*/, '');
            })
            .filter(q => q.length > 0 && q.length <= 20)
            .slice(0, 3);

        if (questions.length === 0) {
            return res.status(500).json({ error: '質問の生成に失敗しました。' });
        }

        res.json({ questions });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました。' });
    }
});

// ヘルスチェック
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`プロキシサーバーがポート ${PORT} で起動しました`);
    console.log(`環境変数 OPENAI_API_KEY が設定されているか: ${process.env.OPENAI_API_KEY ? 'はい' : 'いいえ'}`);
});

