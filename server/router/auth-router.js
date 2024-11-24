const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
// const { signupSchema, logininSchema } = require("../validators/auth-validator");
// const authMiddleware = require("../middlewares/auth-middleware");

// const validate = require("../middlewares/validate-middleware");

router.route("/").get(authControllers.home);

// Register
router.route("/register").post(authControllers.userRegister);
router.route("/register/faculty").post(authControllers.facultyRegister);
// // Login  Of Student
router.route("/login").post(authControllers.userLogin);
router.route("/login/faculty").post(authControllers.facultyLogin);
router.route("/current/user").get(authControllers.getCurrentUser);

// Chnage password 
router.route("/change/password").patch(authControllers.changePasswordUser);// For User

module.exports = router;