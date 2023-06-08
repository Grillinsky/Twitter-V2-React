const { mongoose, Schema } = require("../db");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  description: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tweets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.pre("save", async function (next) {
  // Solo hashear la contraseña si ha sido modificada o es nueva
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(this.password, 10);

    // Reemplazar la contraseña en texto plano por la contraseña hasheada
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
