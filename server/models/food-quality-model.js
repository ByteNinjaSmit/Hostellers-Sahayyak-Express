const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// Define the FoodQuality schema
const foodqualitySchema = new mongoose.Schema({
    foodOwner: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    complaint: {
      type: [String],
      required: true, // It is Hygene
    },
    status: {
      type: String,
      default: "Not Processed",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);



const FoodQuality = new mongoose.model("FoodQuality", foodqualitySchema);
module.exports = FoodQuality;
