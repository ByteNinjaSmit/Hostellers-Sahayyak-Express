const mongoose = require("mongoose");


// Define the Safety schema
const safetySchema =  new mongoose.Schema(
  {
    complaint: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      default: "Not Processed",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Corrected here
      ref: "User", // Reference to the user who submitted the complaint
    },
    actionLog: [
      {
        action: {
          type: String,
          required: true, // Example: "Processed", "Resolved", "In Progress"
        },
        actionTakenBy: {
          type: String,
          required: true,
        },
        actionDate: {
          type: Date,
          default: Date.now,
        },
        remarks: {
          type: String, // Optional field for additional information
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Define the Safety model
const Safety = new mongoose.model("Safety", safetySchema);
module.exports = Safety;
