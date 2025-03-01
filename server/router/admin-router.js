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
// GET Attendance Signle Hostel Of Particular Date
router.route("/get-attendance-by-hostel-and-date/:hostelId/:date").get(adminControllers.getSingleHostelDateWise);
// PUT Attendance One By One User Data
router.route("/save-attendance-one-by-one").post(adminControllers.putAttendanceOneByOneUserData);


//------------
// Regarding Hostel Location
//------------

// New Location
router.route("/new-hostel-location").post(adminControllers.newHostelAddr);
// Get Location
router.route("/get-hostel-location/:name").get(adminControllers.getHostelLocation);
// Update Location
router.route("/update-hostel-location/:id").patch(adminControllers.updateHostelLocation);
// Delete Location
router.route("/delete-hostel-location/:id").delete(adminControllers.deleteHostelLocation);
// GET ALL hostel Location
router.route("/get-all-hostel-location").get(adminControllers.getAllHostelLocation);


module.exports = router;

