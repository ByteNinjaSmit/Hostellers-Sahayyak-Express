const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin-controller");


// -----
// Regarding Issue Actions
//------


// GET All Issue
router.route("/get-all-issue").get(adminControllers.getAllIssues);
// GET Single Isuue
router.route("/get-issue/:issueid").get(adminControllers.getIssue);
// Update Status Issue
router.route("/update-issue-status/:issueid").patch(adminControllers.updateIssueStatus);
router.route("/update-issue/:issueid").patch(adminControllers.updateIssue);


//---------
// Regarding User Actions
// -------

// GET All User
router.route("/get-all-user").get(adminControllers.getUsers);
// GET Single User
router.route("/get-user/:id").get(adminControllers.getUser);
router.route("/get-hostel-users/:hostelId").get(adminControllers.getHostelUsers);
// Update user
router.route("/update-user/:userId").patch(adminControllers.updateUser);
// Chnage user Password
router.route("/change-user-password/:userId").patch(adminControllers.changePasswordUser);
// DELETE User
router.route("/delete-user/:userId").delete(adminControllers.deleteUser);


// ----------
// Regarding Attendance
//--------------
// GET All Attendance
router.route("/get-all-attendance").get(adminControllers.getAllAttendance);
// By ID
router.route("/get-attendance/:id").get(adminControllers.getAttendanceById);
// New Save Attendace All Students 
router.route("/save-attendance-all").post(adminControllers.newAttendance);
// Update Attendance
router.route("/update-attendance/:id").patch(adminControllers.updateAttendance);



module.exports = router;

