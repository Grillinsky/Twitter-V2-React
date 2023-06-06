const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.email }],
  });
  if (user) {
    checkPass = await bcrypt.compare(req.body.password, user.password);

    if (checkPass) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
      const userToFront = { ...user._doc, token: token };
      delete userToFront.password;

      return res.status(201).json(userToFront);
    }
  } else {
    return res.status(401).send({ message: "Incorrect Credentials" });
  }
}

async function signUp(req, res) {
  console.log(req.body);
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });

  if (user) {
    console.log(user);
    return res
      .status(409)
      .send({ message: "User already registered, try with an other email or username" });
  } else {
    const newUser = await User.create({
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10), // TODO: pasar el hasheo de pass al modelo buscar middlewares de mongoose
    });

    if (newUser) {
      const user = await User.findOne({
        $or: [{ email: newUser.email }, { username: newUser.username }],
      });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "10h" });
      const userToFront = { ...user._doc, token: token };
      delete userToFront.password;

      return res.status(201).json(userToFront);
    } else {
      return res.status(502).send({ message: "User cannot be created, try later" });
    }
  }
}

async function logOut(req, res) {
  res.clearCookie("token");
  console.log("logged out successfully");
  res.json({ message: "Logged out successfully" });
}

//TODO: hacer edit password

module.exports = { login, signUp, logOut };
