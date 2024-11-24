const mongoose = require("mongoose");



// Define the FoodOwner schema
const foodownerSchema = new mongoose.Schema(
  {
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
      required: true, // It is an array of complaints
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


const FoodOwner = new mongoose.model("FoodOwner", foodownerSchema);
module.exports = FoodOwner;