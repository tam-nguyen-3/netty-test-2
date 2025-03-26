const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Auth routes
router.post("/create-profile", authController.createProfile);
router.get("/auto-login", authController.autoLogin);
router.post("/login", authController.login);

module.exports = router;
