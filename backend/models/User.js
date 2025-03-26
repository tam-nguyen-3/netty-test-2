const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profession: { type: String, required: true },
  interests: [String],
  bio: String,
  organization: String,
  location: String,
  email: {
    type: String,
    index: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
});

module.exports = mongoose.model("User", UserSchema);
