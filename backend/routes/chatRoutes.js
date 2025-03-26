const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Chat routes
router.post("/chat", chatController.processChat);

module.exports = router;
