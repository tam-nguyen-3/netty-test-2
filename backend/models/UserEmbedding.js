const mongoose = require("mongoose");

const userEmbeddingSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  embedding: { type: [Number], required: true },
  profileText: { type: String, required: true },
});

const UserEmbedding = mongoose.model("UserEmbedding", userEmbeddingSchema);

module.exports = UserEmbedding;
