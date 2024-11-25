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




module.exports = router;

