const User = require("../models/User");
const formidable = require("formidable");

// Display the specified resource.
async function index(req, res) {
  const user = await User.findOne({ username: req.params.username }).populate({
    path: "tweets",
    populate: { path: "author", options: { strictPopulate: false } },
  });
  const userToFront = user._doc;
  delete userToFront.password;

  return res.json(userToFront);
}

// Update the specified resource in storage.
function update(req, res) {
  const form = formidable({
    multiples: false,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    const userUpdate = {
      firstname: fields.firstname,
      lastname: fields.lastname,
      username: fields.username,
      description: fields.description,
      avatar: files.avatar.newFilename,
    };

    const user = await User.findByIdAndUpdate(req.auth.userId, userUpdate, { new: true });
    console.log(user);

    const userToFront = user._doc;
    delete userToFront.password;

    return res.json(userToFront);
  });
}

async function handlerFollow(req, res) {
  const userToFollow = await User.findById(req.body.followingId);
  const currentUser = await User.findById(req.auth.userId);

  let msg = "";

  if (!userToFollow.followers.includes(req.auth.userId)) {
    userToFollow.followers.push(req.auth.userId);
    currentUser.following.push(req.body.followingId);
    await userToFollow.save();
    await currentUser.save();
    msg = "followed";
  } else {
    const newFollowers = userToFollow.followers.filter((follower) => follower != req.auth.userId);
    userToFollow.followers = newFollowers;
    await userToFollow.save();

    const newFollowings = currentUser.following.filter(
      (following) => following != req.body.followingId,
    );
    currentUser.following = newFollowings;
    await currentUser.save();
    msg = "unfollowed";
  }
  res.status(201).send(msg);
}

async function getFollowers(req, res) {
  console.log(req.body);
  const user = await User.findOne({ username: req.params.username }).populate("followers");
  return res.json(user.followers);
}

async function getFollowing(req, res) {
  console.log(req.body);

  const user = await User.findOne({ username: req.params.username }).populate("following");

  return res.json(user.following);
}

module.exports = {
  index,
  update,
  handlerFollow,
  getFollowers,
  getFollowing,
};
