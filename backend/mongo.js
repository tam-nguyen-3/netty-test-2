// FOR TESTING ONLY
// CONVERT CURRENT TEST DATA TO EMBEDDING

require("dotenv").config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const UserEmbedding = require("./models/UserEmbedding");

// Initialize Google AI
const apiKey = process.env.GOOGLE_API_KEY;
const genai = new GoogleGenerativeAI(apiKey);

// Read test data
const rawData = fs.readFileSync("./data.json", "utf-8");
const data = JSON.parse(rawData);

const embedModel = genai.getGenerativeModel({ model: "text-embedding-004" });

// Helper function to create embeddings
const createEmbedding = async (text) => {
  const response = await embedModel.embedContent(text);
  return response.embedding.values;
};

const profileToText = (data) => {
  const textLines = Object.entries(data).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}: [${value.join(", ")}]`;
    } else {
      return `${key}: ${value}`;
    }
  });
  return textLines.join("; ");
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Process each member
    for (const member of data) {
      // Create text representation of member
      const memberText = profileToText(member);
      console.log(memberText);
      
      try {
        // Generate embedding
        const embedding = await createEmbedding(memberText);

        // Store in MongoDB
        await UserEmbedding.findOneAndUpdate(
          { userId: member.id.toString() },
          {
            userId: member.id.toString(),
            embedding: embedding,
            profileText: memberText,
          },
          { upsert: true }
        );

        console.log(`Stored embedding for user ${member.id}`);
      } catch (error) {
        console.error(`Error processing user ${member.id}:`, error);
      }
    }

    console.log("Finished processing all users");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
