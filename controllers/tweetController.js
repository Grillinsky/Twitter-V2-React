const User = require("../models/User");
const Tweet = require("../models/Tweet");
const { update } = require("lodash");

async function index(req, res) {
  const tweets = [];
  const user = await User.findById(req.auth.userId);

  for (let i = 0; i < user.following.length; i++) {
    const followingTweets = await User.findById(user.following[i]).populate("tweets");
    tweets.push(followingTweets.tweets);
  }

  res.json(tweets);
}

async function store(req, res) {
  const newTweet = await Tweet.create({
    content: req.body.content,
    author: req.auth.userId,
  });

  newTweet
    ? res.json(newTweet)
    : res.status(409).send({ message: "Something went wrong, try again later" });
}

async function destroy(req, res) {
  const id = req.params.id;

  await Tweet.findByIdAndDelete(id);

  return res.status(200).send({ message: "Tweet deleted" });
}

async function likesHandler(req, res) {
  const id = req.body.tweetId;
  const tweet = await Tweet.findById(id);
  let msg = "";

  if (!tweet.likes.includes(req.auth.userId)) {
    tweet.likes.push(req.auth.userId);
    await tweet.save();
    msg = "liked";
  } else {
    const newLikes = tweet.likes.filter((like) => like != req.auth.userId);
    tweet.likes = newLikes;
    await tweet.save();
    msg = "unliked";
  }
  res.status(201).send(msg);
}

module.exports = {
  index,
  store,
  destroy,
  likesHandler,
};
