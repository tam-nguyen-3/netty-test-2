require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("./models/Chat");
const mongoose = require("mongoose");
const {
  getContextualProfiles,
  cleanChatHistory,
  extractIdsFromResponse,
} = require("./helper");

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// AI Models
const apiKey = process.env.GOOGLE_API_KEY;
const genai = new GoogleGenerativeAI(apiKey);
const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });

// Load user data TODO: replace with mongodb
const rawData = fs.readFileSync("./data.json", "utf-8");
const data = JSON.parse(rawData);

// Helper functions
const getUserProfile = (userId) => {
  return data.find((user) => user.id === userId);
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", async (req, res) => {
  try {
    const { userId, query } = req.body;
    if (!query || !userId) {
      return res.status(400).json({ error: "No query or userId provided" });
    }
    const currentUserProfile = getUserProfile(userId);
    if (!currentUserProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }
    let currentChat =
      (await Chat.findOne({ userId })) || new Chat({ userId, history: [] });

    if (!currentChat.history.length || currentChat.history[0].role !== "user") {
      currentChat.history.unshift({
        role: "user",
        parts: [{ text: "Hello" }],
      });
    }

    // get contextual profiles, update new prompt
    const contextualProfiles = await getContextualProfiles(userId, query);
    const promptWithProfiles = `Current user profile: ${JSON.stringify(
      currentUserProfile,
      null,
      2
    )}\nUser query: "${query}"\nThe most relevant profiles: ${JSON.stringify(
      contextualProfiles,
      null,
      2
    )}`;

    currentChat.history.push({
      role: "user",
      parts: [{ text: promptWithProfiles }],
    });

    const chatSession = model.startChat({
      history: [
        ...cleanChatHistory(currentChat.history),
        {
          role: "model",
          parts: [
            {
              text: "Speak in a professional, friendly, and first-person tone, using words like 'I' and 'let me'. You are a helpful networking assistant. Your goal is to suggest relevant people to the user based on: 1) The user's query (first priority), and 2) The user's profile (second priority). Explain why they might be good connections. Always mention the suggested people's ID and name. Include the IDs and names in this format: (ID: 123, Name: John Doe)—no need to mention the similarity score. Provide a maximum of 3 suggestions. Do not respond in code block format.",
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    const result = await chatSession.sendMessage(promptWithProfiles);
    const responseText = result.response.text();

    currentChat.history.push({
      role: "model",
      parts: [{ text: responseText }],
    });

    await currentChat.save();

    // Extract suggested IDs from response
    const ids = extractIdsFromResponse(responseText);

    res.json({
      message: responseText,
      suggestedIds: ids,
    });
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
