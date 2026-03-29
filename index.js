require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const client = new Anthropic();

app.use(express.json());
app.use(express.static('public'));

const SYSTEM_PROMPT = `You are an AI agent assistant for a WFG financial services agency. 
You help with prospect follow-up, persistency management, and team activity tracking. 
Be direct, short, and action-oriented. No fluff.`;

app.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  const messages = [
    ...(history || []),
    { role: 'user', content: message }
  ];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages
  });

  res.json({ reply: response.content[0].text });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));