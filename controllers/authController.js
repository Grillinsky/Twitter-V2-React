const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");

async function login(req, res) {
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.email }],
  });
  if (user) {
    checkPass = await bcrypt.compare(req.body.password, user.password);

    if (checkPass) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "10h" });
      user._doc.token = token;

      return res.status(201).json(user);
    }
  } else {
    return res.status(401).send({ message: "Incorrect Credentials" });
  }
}

async function signUp(req, res) {
  const form = formidable({
    multiples: false,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    console.log(fields.email);
    const user = await User.findOne({
      $or: [{ email: fields.email }, { username: fields.username }],
    });

    if (user) {
      return res
        .status(409)
        .send({ message: "User already registered, try with an other email or username" });
    } else {
      const stringifyPass = fields.password;
      const newUser = await User.create({
        firstname: fields.firstname,
        lastname: fields.lastname,
        username: fields.username,
        email: fields.email,
        password: stringifyPass.toString(),
      });

      if (files.avatar) {
        newUser.avatar = files.avatar.newFilename;
        newUser.save();
      }
      if (newUser) {
        const user = await User.findOne({
          $or: [{ email: newUser.email }, { username: newUser.username }],
        });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "10h",
        });
        const userToFront = { userId: user.id, token: token, username: user.username };

        return res.status(201).json(userToFront);
      } else {
        return res.status(502).send({ message: "User cannot be created, try later" });
      }
    }
  });
}

async function logOut(req, res) {
  res.clearCookie("token");
  console.log("logged out successfully");
  res.json({ message: "Logged out successfully" });
}

//TODO: hacer edit password

module.exports = { login, signUp, logOut };
