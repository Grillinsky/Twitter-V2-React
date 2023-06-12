const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController");
var { expressjwt: checkJwt } = require("express-jwt");

// router.get("*", function (req, res) {
//   res.status(404).render("pages/404");
// });

router.use(checkJwt({ secret: process.env.JWT_SECRET_KEY, algorithms: ["HS256"] }));
router.get("/", tweetController.index);
router.post("/tweets", tweetController.store);
router.get("/tweets/:id", tweetController.getTweet);
router.post("/tweets/:id", tweetController.likesHandler);
router.delete("/tweets/:id", tweetController.destroy);
router.get("/:username", userController.index);
router.patch("/:username", userController.update);
router.post("/:username/follow", userController.handlerFollow);
router.get("/:username/followers", userController.getFollowers);
router.get("/:username/followings", userController.getFollowing);

module.exports = router;
