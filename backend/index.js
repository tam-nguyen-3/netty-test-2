require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3001;
const { GoogleGenerativeAI } = require("@google/generative-ai");
app.use(express.json());
app.use(cors()); // Add CORS middleware
// Load members from data.json
const members = require("./data.json");
const apiKey = process.env.GOOGLE_API_KEY;

// Initialize Google Generative AI client
const genai = new GoogleGenerativeAI(apiKey);
const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Convert data.json to object
const fs = require("fs");
const rawData = fs.readFileSync("./data.json", "utf-8");
const data = JSON.parse(rawData);

// Convert each member's data to a string
const memberStrings = data.map((member) => {
  return `${member.name} is a ${member.age}-year-old ${
    member.profession
  } interested in ${member.interests.join(", ")}`;
});

// Helper function to create embeddings for a text
async function createEmbedding(text) {
  const embedModel = genai.getGenerativeModel({
    model: "text-embedding-004",
  });
  const response = await embedModel.embedContent(text);
  return response.embedding.values;
}

// Helper function to find similar profiles using embeddings
async function findSimilarProfiles(query) {
  const queryEmbedding = await createEmbedding(query);
  const profilesWithScores = await Promise.all(
    memberStrings.map(async (member) => {
      const profileEmbedding = await createEmbedding(member);
      const similarity = cosineSimilarity(queryEmbedding, profileEmbedding);
      return { ...member, similarity };
    })
  );
  return profilesWithScores.sort((a, b) => b.similarity - a.similarity);
}

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}

// POST /chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "No query provided" });
    }

    const similarProfiles = await findSimilarProfiles(query);

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `User query: "${query}"\nAvailable profiles: ${JSON.stringify(
                similarProfiles,
                null,
                2
              )}`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "You are a helpful networking assistant. Your goal is to suggest relevant people based on the user's interests and explain why they might be good connections.",
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 200,
      },
      // safetySettings: [
      //   { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM" },
      // ],
    });

    const result = await chat.sendMessage(query);
    const response = result.response;
    const text = response.text();
    console.log(text);
    res.json({ message: text });
  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    res.status(500).json({
      error: "Error processing the request",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*

// Helper function to create embeddings for a text
async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// Helper function to find similar profiles using embeddings
async function findSimilarProfiles(query) {
  const queryEmbedding = await createEmbedding(query);

  // For each member, create an embedding of their skills and interests
  const profilesWithScores = await Promise.all(
    members.map(async (member) => {
      const profileText = `${member.skills.join(" ")} ${member.interests.join(
        " "
      )}`;
      const profileEmbedding = await createEmbedding(profileText);

      // Calculate cosine similarity
      const similarity = cosineSimilarity(queryEmbedding, profileEmbedding);
      return { ...member, similarity };
    })
  );

  // Sort by similarity score
  return profilesWithScores.sort((a, b) => b.similarity - a.similarity);
}

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}

app.post("/chat", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }


const completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{
      role: "user",
        content: "Write a one-sentence bedtime story about a unicorn.",
      },
    ],
  });

  const response = completion.choices[0].message.content;
  console.log(response);

  // try {
  //   // Find similar profiles
  //   const similarProfiles = await findSimilarProfiles(query);

  //   // Generate response using ChatGPT
  //   const completion = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "You are a helpful networking assistant. Your goal is to suggest relevant people based on the user's interests and explain why they might be good connections.",
  //       },
  //       {
  //         role: "user",
  //         content: `User query: "${query}"\nAvailable profiles: ${JSON.stringify(
  //           similarProfiles,
  //           null,
  //           2
  //         )}`,
  //       },
  //     ],
  //     temperature: 0.7,
  //     max_tokens: 500,
  //   });

  //   const response = completion.choices[0].message.content;
  //   res.json({
  //     message: response,
  //     suggestedProfiles: similarProfiles,
  //   });
  // } catch (error) {
  //   console.error(
  //     "Error:",
  //     error.response ? error.response.data : error.message
  //   );
  //   res.status(500).json({ error: "Error processing the request." });
  // }
});

 */
