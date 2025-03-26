const { GoogleGenerativeAI } = require("@google/generative-ai");
const UserEmbedding = require("./models/UserEmbedding");

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const embedModel = genai.getGenerativeModel({ model: "text-embedding-004" });

// create embedding given text
const createEmbedding = async (text) => {
  const response = await embedModel.embedContent(text);
  return response.embedding.values;
};

// convert profile to text. data
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

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
};

const findSimilarProfiles = async (userId, queryEmbedding, topN = 10) => {
  const users = await UserEmbedding.find({});

  const profilesWithScores = users
    .map((user) => ({
      userId: user.userId,
      profileText: user.profileText,
      similarity: cosineSimilarity(queryEmbedding, user.embedding),
    }))
    .filter((profile) => profile.userId !== userId);

  return profilesWithScores
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
};

const getContextualProfiles = async (userId, query) => {
  const queryEmbedding = await createEmbedding(query);
  const similarProfiles = await findSimilarProfiles(userId, queryEmbedding);

  return similarProfiles.map((profile) => ({
    userId: profile.userId,
    profileText: profile.profileText,
  }));
};

const cleanChatHistory = (history) => {
  return history.map((message) => ({
    role: message.role,
    parts: message.parts.map((part) => ({
      text: part.text,
    })),
  }));
};

const extractIdsFromResponse = (responseText) => {
  const idMatches = responseText.match(/ID:\s*(\d+)/g);
  return idMatches ? idMatches.map((match) => match.replace(/ID:\s*/, "")) : [];
};

/**
 * Updates or creates embedding for a user profile
 * @param {Object} profile - The user profile data
 * @returns {Promise<void>}
 */

const updateUserEmbedding = async (profile) => {
  try {
    const profileText = profileToText(profile);
    const embedding = await createEmbedding(profileText);
    await UserEmbedding.findOneAndUpdate(
      { userId: profile.id.toString() },
      {
        userId: profile.id.toString(),
        embedding: embedding,
      },
      { upsert: true }
    );

    console.log(`Successfully updated embedding for user ${profile.id}`);
  } catch (error) {
    console.error(`Error updating embedding for user ${profile.id}:`, error);
    throw error;
  }
};

module.exports = {
  updateUserEmbedding,
  createEmbedding,
  profileToText,
  cosineSimilarity,
  findSimilarProfiles,
  getContextualProfiles,
  cleanChatHistory,
  extractIdsFromResponse,
};
