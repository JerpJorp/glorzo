import express from 'express';
import cors from 'cors';
import { ExampleSharedType, TestApiResponse } from '@glorzo/shared';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    const response: ExampleSharedType = { message: 'Hello from Backend!' };
    res.json(response);
});

app.get('/api/test', (req, res) => {
    const response: TestApiResponse = {
        status: 'success',
        data: {
            id: 1,
            name: 'Test Item',
            timestamp: new Date().toISOString()
        },
        sharedMessage: { message: 'This comes from shared lib via backend' }
    };
    res.json(response);
});

app.get('/api/models', async (req, res) => {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ error: 'Failed to fetch models' });
    }
});

app.post('/api/chat', async (req, res) => {
    const { model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty } = req.body;

    if (!model || !messages) {
        return res.status(400).json({ error: 'Model and messages are required' });
    }

    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        // Log key status for debugging (don't log full key in production)
        console.log('API Key Status:', apiKey ? 'Present' : 'Missing');
        if (apiKey) {
            console.log('API Key length:', apiKey.length);
            console.log('API Key start:', apiKey.substring(0, 10) + '...');
        }

        if (!apiKey || apiKey === 'undefined' || apiKey === 'null') {
            // Fallback for demo purposes if no key is set or invalid string
            console.warn('No OPENROUTER_API_KEY set or invalid. Returning mock response.');
            return res.json({
                choices: [{
                    message: {
                        role: 'assistant',
                        content: `[MOCK RESPONSE] You are chatting with ${model}. To get real responses, please set the OPENROUTER_API_KEY environment variable in the backend.`
                    }
                }]
            });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: temperature ? parseFloat(temperature) : undefined,
                max_tokens: max_tokens ? parseInt(max_tokens) : undefined,
                top_p: top_p ? parseFloat(top_p) : undefined,
                frequency_penalty: frequency_penalty ? parseFloat(frequency_penalty) : undefined,
                presence_penalty: presence_penalty ? parseFloat(presence_penalty) : undefined
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API Error:', response.status, response.statusText, errorText);

            // Try to parse JSON error if possible
            try {
                const errorJson = JSON.parse(errorText);
                return res.status(response.status).json(errorJson);
            } catch (e) {
                return res.status(response.status).json({ error: 'OpenRouter API Error', details: errorText });
            }
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
