const User = require("../models/User");
const Tweet = require("../models/Tweet");
const bcrypt = require("bcryptjs");

// Display the specified resource.
async function show(req, res) {
  const { username } = req.params;

  const user = await User.findOne({ username: username }).populate("tweets");

  //const isFollowing = user.followers.includes(loggedInUserId);
  return res.render("pages/userProfile", { user });
}

// Show the form for creating a new resource
async function create(req, res) {
  return res.render("createUser");
}

// Store a newly created resource in storage.
async function store(req, res) {
  const form = formidable({
    multiples: false,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    const passwordHasheada = await bcrypt.hash(fields.password, 10);
    const user = new User({
      firstname: fields.firstname,
      lastname: fields.lastname,
      username: fields.username,
      description: fields.description,
      password: passwordHasheada,
      avatar: files.avatar.newFilename,
    });
    await user.save();
    return res.redirect("home");
  });
}

// Show the form for editing the specified resource.
async function edit(req, res) {
  const { id } = req.params;

  const user = await User.findByPk(id);

  return res.render("editUser", { user });
}

// Update the specified resource in storage.
async function update(req, res) {
  const id = req.params.id;

  const form = formidable({
    multiples: false,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    const passwordHasheada = await bcrypt.hash(fields.password, 10);
    const userUpdate = {
      firstname: fields.firstname,
      lastname: fields.lastname,
      username: fields.username,
      description: fields.description,
      password: passwordHasheada,
      avatar: files.avatar.newFilename,
    };

    await User.findByIdAndUpdate(id, userUpdate);

    return res.redirect("home");
  });
}

// Remove the specified resource from storage.
async function destroy(req, res) {
  const { id } = req.params;

  const user = await User.findByPk(id);

  await user.destroy();

  return res.redirect("/");
}

async function addFollower(req, res) {
  const { userId, followerId } = req.params;

  await User.findByIdAndUpdate(userId, { $addToSet: { followers: followerId } }, { new: true });

  return res.redirect("home");
}

async function removeFollower(req, res) {
  const { userId, followerId } = req.params;

  await User.findByIdAndUpdate(userId, { $pull: { followers: followerId } }, { new: true });

  return res.redirect("home");
}

async function getFollowers(req, res) {
  const loggedInUserId = req.user.id;

  const user = await User.findById(loggedInUserId).populate("followers");

  return res.render("pages/followers", { followers: user.followers });
}

async function getFollowing(req, res) {
  const loggedInUserId = req.user.id;

  const user = await User.findById(loggedInUserId).populate("following");

  return res.render("pages/followings", { following: user.following });
}

module.exports = {
  show,
  create,
  store,
  edit,
  update,
  destroy,
  addFollower,
  removeFollower,
  getFollowers,
  getFollowing,
};
