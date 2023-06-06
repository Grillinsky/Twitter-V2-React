const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/users/signup", authController.signUp);
router.get("/logout", authController.logOut);

module.exports = router;
