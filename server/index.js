const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { CohereClient } = require('cohere-ai');

// Load env variables
dotenv.config();

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, 
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Cohere Interview Question Generator API is running 🚀');
});

// Route to generate questionsadd
app.post('/generate-questions', async (req, res) => {
  const { jobRole } = req.body;

  if (!jobRole) {
    return res.status(400).json({ error: 'Job role is required' });
  }

  try {
    const prompt = `Generate 5 interview questions (mix of HR, MCQ, and technical) for the job role: ${jobRole}`;

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    const output = response.generations[0].text.trim();
    const questions = output.split('\n').filter(q => q.trim() !== '');

    res.json({ questions });
  } catch (err) {
    console.error('❌ Error generating questions:', err.message);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
