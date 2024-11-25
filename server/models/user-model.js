const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  hostelId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
// secure the password
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    console.log("Password is not modified");
    return next(); // Added return here
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    console.log(error);
  }
});

// Compare bcrypt password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// JSON WEB TOKEN
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userID: this._id.toString(),
        room: this.room,
        hostelId: this.hostelId,
        role:"student",
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) { 
    console.error(error);
  }
};

//  Exporting Model
const User = new mongoose.model("User", userSchema);
module.exports = User;