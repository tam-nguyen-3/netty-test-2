const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const { updateUserEmbedding } = require("../helper");

// Create temporary profile & token
const createProfile = async (req, res) => {
  try {
    const { name, email, profession, interests, bio, organization, location } =
      req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists",
        message: "A profile with this email already exists",
      });
    }

    // generate random id
    const userId = uuidv4();

    // create new user
    const newUser = new User({
      userId,
      name,
      email,
      profession,
      interests,
      bio,
      organization,
      location,
    });

    // save user to db
    await newUser.save();

    // Update embeddings for the new user
    await updateUserEmbedding(newUser);

    // generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.json({
      userId,
      token,
      message: "Profile created! Save your ID if you want to log in later.",
    });
  } catch (error) {
    console.error("Error in /create-profile endpoint:", error);
    res.status(500).json({
      error: "Error creating profile",
      details: error.message,
    });
  }
};

// Auto login with token for same device
const autoLogin = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userId: decoded.userId, message: "Auto-login successful" });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Login using saved user id
// the login endpoint only requires the userId in the request body, and it's expecting it as a simple JSON object.
const login = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "No userId provided" });
  }
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    res.json({ userId, token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in", details: error.message });
  }
};

module.exports = {
  createProfile,
  autoLogin,
  login,
};
