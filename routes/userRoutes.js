const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");

// router.post("/:username", tweetController.likesHandler);

router.get("/:username/follower", userController.getFollowers);
router.get("/:username/following", userController.getFollowing);

module.exports = router;
