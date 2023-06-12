const User = require("../models/User");
const formidable = require("formidable");

// Display the specified resource.
async function index(req, res) {
  const user = await User.findOne({ username: req.params.username })
    .populate({
      path: "tweets",
      populate: { path: "author", options: { strictPopulate: false } },
    })
    .select("-password");

  return res.json(user);
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

    const user = await User.findByIdAndUpdate(req.auth.userId, userUpdate, { new: true }).select(
      "-password",
    );

    return res.json(user);
  });
}

async function handlerFollow(req, res) {
  const userToFollow = await User.findOne({ username: req.params.username });
  const currentUser = await User.findById(req.auth.userId);

  let msg = "";

  if (!userToFollow.followers.includes(req.auth.userId)) {
    userToFollow.followers.push(req.auth.userId);
    currentUser.following.push(userToFollow._id);
    await userToFollow.save();
    await currentUser.save();
    msg = "followed";
    console.log(msg);
  } else {
    const newFollowers = userToFollow.followers.filter((follower) => follower != req.auth.userId);
    const newFollowings = [];

    for (let i = 0; i < currentUser.following.length; i++) {
      if (currentUser.following[i].toString() != userToFollow.id) {
        newFollowings.push(currentUser.following[i]);
      }
    }

    console.log(newFollowings);
    userToFollow.followers = newFollowers;
    currentUser.following = newFollowings;

    await currentUser.save();
    await userToFollow.save();

    msg = "unfollowed";
    console.log(msg);
  }
  res.status(201).send(msg);
}

async function getFollowers(req, res) {
  const user = await User.findOne({ username: req.params.username }).populate("followers");
  return res.json(user.followers);
}

async function getFollowing(req, res) {
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
