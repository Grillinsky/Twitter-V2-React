const User = require("../models/User");
const Tweet = require("../models/Tweet");

function index(req, res) {
  res.send("Home");
}

function create(req, res) {
  return res.render("createTweet");
}

async function store(req, res) {
  const { content, authorId } = req.body;

  const author = await User.findById(authorId);

  const tweet = new Tweet({ content, author });

  await tweet.save();

  return res.redirect("/tweets");
}

async function destroy(req, res) {
  const { id } = req.params;

  await Tweet.findByIdAndDelete(id);

  return res.redirect("/tweets");
}

async function likesHandler(req, res) {
  const tweet = await Tweet.findById(req.body.tweetId);

  const liked = tweet.likes.includes(req.body.id);

  if (!liked) {
    console.log("liked");
    tweet.likes.push(req.user._id);
  } else {
    console.log("unliked");
    const newLikes = tweet.likes.filter((like) => {
      return like !== req.user._id;
    });
    console.log(newLikes);
    // tweet.likes.push(newLikes);
  }

  await tweet.save();

  return res.redirect("back");
}

module.exports = {
  index,
  create,
  store,
  destroy,
  likesHandler,
};
