const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user-controller");


router.route("/get-user/:userid").get(userControllers.getUser);
// New issue
router.route("/new-issue/:user/:issue").post(userControllers.newIssue);  // in this API going Image

// Get All Issue Of user
router.route("/get-all-issue/:userId").get(userControllers.getIssuesAllUser);

// get Single Issue
router.route("/get-issue/:issueid").get(userControllers.getIssue);

// Delete issue
router.route("/delete-issue/:issueid").delete(userControllers.deleteIssue);

// Update Issue
router.route("/update-issue/:issueid").patch(userControllers.updateIssueStatus);

// Store User Image
router.route("/store-image").post(userControllers.storeUserImage);
// GET User Image
router.route("/get-image/:userId").get(userControllers.getUserImage)

// GET Attendace All Record
router.route("/get-attendance-record/:id").get(userControllers.getAttendance);

// GET Hostel Location Address
router.route("/get-hostel-location/:name").get(userControllers.getHostelLocation);

// Mark Self Attendance
router.route("/mark-self-attendance").post(userControllers.putAttendanceOneByOneUserData);

// GET Attendance Current By ID and Current Date
router.route("/get-attendance-current/:id/:curentdate/:name").get(userControllers.getTodaysAttendance);




module.exports = router;

