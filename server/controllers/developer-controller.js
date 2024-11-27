require("dotenv").config();
const Developer = require("../models/developer-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Models
const DrinkWater = require("../models/drink-water-model");
const Room = require("../models/room-model");
const CommonArea = require("../models/commonArea-model");
const Corridor = require("../models/corridor-model");
const FoodQuality = require("../models/food-quality-model");
const FoodOwner = require("../models/food-owner-model");
const NetworkConn = require("../models/network-model");
const Safety = require("../models/safety-model");
const User = require("../models/user-model");
const Faculty = require("../models/high-authority-model");
const Attendance = require("../models/attendance-model");

// *--------------------------
// Developer Registration Logic
// *--------------------------


const developerRegister = async (req, res) => {
    try {
        // const { name, username, email, password } = req.body;
        const name = process.env.DEVELOPER_NAME;
        const username = process.env.DEVELOPER_USERNAME;
        const email = process.env.DEVELOPER_EMAIL;
        const password = process.env.DEVELOPER_PASSWORD;


        const userExist = await Developer.findOne({ username });
        // For No Duplicate
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Creating Account
        const userCreated = await Developer.create({
            name,
            username,
            email,
            password,
        });

        res.status(200).json({
            msg: "Registration Successful",
        });
    } catch (error) {
        next(error);
    }
}

// *--------------------------
// Developer Login Logic
// *--------------------------
const developerLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const userExist = await Developer.findOne({ username });
        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Validate password
        const user = await userExist.comparePassword(password);
        if (user) {
            // Generate token
            const token = await userExist.generateToken();
            
            return res.status(200).json({
                message: "Login Successful",
                token,
                userId: userExist._id.toString(),
            });
        } else {
            return res.status(401).json({ message: "Invalid Email Or Password" });
        }
    } catch (error) {
        next(error);
    }
};

// ------------------
// GET Current User
// ------------------

const getCurrentUser = async (req, res, next) => {
    try {
        const token = req.cookies.authDevToken; // Retrieve token from cookies

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { userID, role } = decoded;

        if (!role || (role !== "developer")) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        // Find the user based on role
        let model;

        if (role === "developer") {
            model = Developer; // Use User model for regular users
        } else {
            return res.status(401).json({ error: "Authentication token not found" });
        }

        const userData = await model.findById({ _id: userID }).select("-password");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with user data (excluding sensitive fields)
        return res.status(200).json({ userData });

    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};

// ---------------------------
// GET ALL User
// -----------------------

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 ,face_image:0}).exec();
        res.status(200).json(users);
    } catch (error) {
        next(error)
    }
}

// ---------------------------
// GET ALL Admins
// -----------------------

const getAdmins = async (req, res, next) => {
    try {
        const users = await Faculty.find({}, { password: 0 }).exec();
        return res.status(200).json(users);
    } catch (error) {
        next(error)
    }
}



module.exports = {
    developerRegister,
    developerLogin ,
    getCurrentUser,
    getUsers,
    getAdmins,
};