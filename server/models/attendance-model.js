const mongoose = require("mongoose");


// Define the Attendance schema
const AttendanceSchema =  new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    hostel: {
      type: String,
      required: true,
    },
    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model for student
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Leave", "Late"],
          required: true,
        },
        remarks: {
          type: String, // Optional field for additional remarks
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);



const Attendance = new mongoose.model("Attendance", AttendanceSchema);
module.exports = Attendance;