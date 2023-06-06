const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  });
  user ? (checkPass = await bcrypt.compare(password, user.password)) : null;
  if (!user || !checkPass) {
    return done(null, false, { message: "Credenciales incorrectas" });
  }
  return done(null, user);
}

async function signUp(req, res) {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    req.flash("info", "Ese usuario ya ha sido registrado");
    return res.redirect("/users/registro");
  } else {
    const newUser = await User.create({
      email: req.body.email,
      fullname: req.body.fullname,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    req.login(newUser, () => {
      return res.redirect("/");
    });
  }
}

async function logOut(req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/login");
  });
}

module.exports = { login, signUp, logOut };
