const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");

// router.get("*", function (req, res) {
//   res.status(404).render("pages/404");
// });

router.get("/", tweetController.index);

module.exports = router;
