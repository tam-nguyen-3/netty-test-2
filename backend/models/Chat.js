const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  history: [
    {
      role: { type: String, enum: ["user", "model"], required: true },
      parts: [{ text: { type: String, required: true } }],
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
