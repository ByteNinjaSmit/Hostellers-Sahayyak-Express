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
    actionLog: {
      type: [
        {
          action: {
            type: String,
            default: "Not Processed",
            required: true, // Example: "Processed", "Resolved", "In Progress"
          },
          actionTakenBy: {
            type: String,
            default: "User",
            required: true,
          },
          actionDate: {
            type: Date,
            default: Date.now, // Timestamp when the action was taken
          },
          remarks: {
            type: String, // Optional field for additional information about the action
            default: "No remarks provided", // Default value for remarks
          },
        },
      ],
      default: [
        {
          action: "Not Processed",
          actionTakenBy: "User",
          actionDate: Date.now(),
          remarks: "No remarks provided",
        },
      ],
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);



const FoodQuality = new mongoose.model("FoodQuality", foodqualitySchema);
module.exports = FoodQuality;
