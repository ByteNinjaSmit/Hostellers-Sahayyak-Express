const mongoose = require("mongoose");
// Define the HostelOther schema
const hostelotherSchema =new mongoose.Schema({
    complaint: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      default: "Not Processed",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who submitted the complaint
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
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);


const HostelOther = new mongoose.model("HostelOther", hostelotherSchema);
module.exports.HostelOther;
