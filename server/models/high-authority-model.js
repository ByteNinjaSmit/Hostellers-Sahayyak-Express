const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const facultySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isRector: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
  },
  hostelId: {
    type: String,
  },
  isHighAuth: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
});

// secure the password
facultySchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    console.log("Password is not modified");
    next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
    console.log("Password hashed successfully");
    next();
  } catch (error) {
    console.log("Error during password hashing:", error);
  }
});

// Compare bcrypt password

facultySchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// JSON WEB TOKEN
facultySchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userID: this._id.toString(),  // Use _id instead of userId
        username: this.username,
        email: this.email,
        isRector: this.isRector,
        isHighAuth: this.isHighAuth,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    // return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Token generation failed");
  }
};


const Faculty = new mongoose.model("Faculty", facultySchema);
module.exports = Faculty;