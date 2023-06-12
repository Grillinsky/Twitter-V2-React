const User = require("../models/User");
const Tweet = require("../models/Tweet");
const { update } = require("lodash");

async function index(req, res) {
  const user = await User.findById(req.auth.userId);

  try {
    const tweets = await Tweet.find({
      author: { $in: [...user.following, user] },
    })
      .limit(20)
      .sort({ createdAt: "desc" })
      .populate("author")
      .select("-password");

    console.log(tweets);
    res.json(tweets);
  } catch (error) {
    console.log("error");
  }
}

async function store(req, res) {
  const newTweet = await Tweet.create({
    content: req.body.content,
    author: req.auth.userId,
  });
  const user = await User.findById(req.auth.userId);
  user.tweets.push(newTweet._id);
  await user.save();
  newTweet
    ? res.json(newTweet)
    : res.status(409).send({ message: "Something went wrong, try again later" });
}

async function destroy(req, res) {
  await Tweet.findByIdAndDelete(req.params.id);

  const user = await User.findById(req.auth.userId);
  const aux = user.tweets;
  const newTweet = aux.filter((t) => t._id != req.params.id);
  user.tweets = newTweet;
  await user.save();
  return res.status(200).send({ message: "Tweet deleted" });
}

async function getTweet(req, res) {
  const tweet = await Tweet.findById(req.params.id).populate("author");

  return res.json(tweet);
}

async function likesHandler(req, res) {
  const tweet = await Tweet.findById(req.params.id);
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
  getTweet,
  likesHandler,
};
