require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;
const apiKey = process.env.OPENAI_API_KEY;

app.use(express.json());

// Sample in-memory data for member profiles
const members = [
  { id: 1, name: 'Alice', skills: ['javascript', 'react'], interests: ['coding', 'music'] },
  { id: 2, name: 'Bob', skills: ['python', 'flask'], interests: ['gaming', 'reading'] },
  // Add more profiles as needed
];

app.get('/', (req, res) => {
  res.send('Hello World!');
}
);

// POST /chat endpoint
app.post('/chat', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }
  
  // Search through profiles: simple keyword matching
  const queryTokens = query.toLowerCase().split(' ');
  const profiles = members.filter(member => {
    const skills = member.skills.map(s => s.toLowerCase());
    const interests = member.interests.map(i => i.toLowerCase());
    return queryTokens.some(token => skills.includes(token) || interests.includes(token));
  });
  console.log('Calling OpenAI API with query:', query);

  // Call the OpenAI API to get a dynamic response
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        prompt: query,
        max_tokens: 150,
        temperature: 0.9,
        n: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    
    const gptResponse = response.data.choices[0].text.trim();
    res.json({ gptResponse, profiles });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error processing the request.' });
  }
});
// // Your axios.post call...
// console.log('OpenAI API response:', response.data);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});