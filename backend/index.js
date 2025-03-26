require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use routes
app.use("/auth", authRoutes); 
app.use("/", chatRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
