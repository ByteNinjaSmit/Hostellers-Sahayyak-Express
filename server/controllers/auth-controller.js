require("dotenv").config();
const User = require("../models/user-model");
const Faculty = require("../models/high-authority-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Developer = require("../models/developer-model");



// on Route
const home = async (req, res) => {
    try {
        res
            .status(200)
            .send(
                "Welcome to world best website mern series by smitraj using router"
            );
    } catch (error) {
        console.log(error);
    }
};

// *--------------------------
// User Registration Logic
// *--------------------------
const userRegister = async (req, res) => {
    try {
        // const reqBody = await request.json();
        const { name, username, roomNumber, hostelName, password } = req.body;
        // Validate that all fields are provided
        if (!username || !roomNumber || !name || !hostelName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExist = await User.findOne({ username });
        // For No Duplicate
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Creating Account
        const userCreated = await User.create({
            name,
            username,
            room: roomNumber,
            hostelId: hostelName,
            password
        });

        res.status(200).json({
            message: "Registration Successful",
        });
    } catch (error) {
        next(error);
    }
}

// *--------------------------
// Faculty Registration Logic
// *--------------------------

const facultyRegister = async (req, res) => {
    try {
        // const reqBody = await request.json();
        const { username, email, hostelId, phone, password } = req.body;
        // Validate that all fields are provided
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExist = await Faculty.findOne({ username });
        // For No Duplicate
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Creating Account
        const userCreated = await User.create({
            username,
            email,
            hostelId,
            phone,
            password
        });

        res.status(200).json({ message: "Registration Successful" });
    } catch (error) {
        next(error);
    }
}

// *--------------------------
// User Login Logic
// *--------------------------

const userLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validate that all fields are provided
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if the user exists
        const userExist = await User.findOne({ username });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Validate password
        const user = await userExist.comparePassword(password);
        if (user) {
            // Generate token
            const token = await userExist.generateToken();

            // Set the cookie with token, secure, httpOnly, and expiration options
            // res.cookie("authToken", token, {
            //     httpOnly: true,        // Accessible only by web server
            //     secure: process.env.NODE_ENV === "production",  // Cookie only sent over HTTPS in production
            //     maxAge: 60 * 60 * 1000, // Cookie expires in 1 hour
            //     sameSite: "strict"      // Protect against CSRF
            // });
            const { password, ...userWithoutPassword } = userExist.toObject();

            return res.status(200).json({
                message: "Login Successful",
                token,
                userId: userExist._id.toString(),
                user: userWithoutPassword,
            });
        } else {
            return res.status(401).json({ message: "Invalid Email Or Password" });
        }
    } catch (error) {
        next(error);
    }
};

// *--------------------------
// Faculty Login Logic
// *--------------------------
const facultyLogin = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;

        // Validate that all fields are provided
        if (!username || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Define the query object
        let query = { username };

        // Modify the query based on the role
        if (role === "rector") {
            query = { username, isRector: true };  // Add condition to find rector
        } else if (role === "higher-authority") {
            query = { username, isHighAuth: true };  // Add condition to find higher authority
        }

        // Check if the user exists
        const userExist = await Faculty.findOne(query);

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Validate password
        const user = await userExist.comparePassword(password);
        if (user) {
            // Generate token
            const token = await userExist.generateToken();


            const { password, ...userWithoutPassword } = userExist.toObject();
            return res.status(200).json({
                message: "Login Successful",
                token,
                userId: userExist._id.toString(),
                user: userWithoutPassword,
            });
        } else {
            return res.status(401).json({ message: "Invalid Email Or Password" });
        }
    } catch (error) {
        next(error);
    }
};


const getCurrentUser = async (req, res, next) => {
    try {
        const token = req.cookies.authToken; // Retrieve token from cookies

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { userID, role } = decoded;

        if (!role || (role !== "faculty" && role !== "student" && role!=="developer")) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        // Find the user based on role
        let model;

        if (role === "student") {
            model = User; // Use User model for regular users
        } else if (role === "faculty") {
            model = Faculty; // Use Faculty model for admins or high-authority users
        } else if (role === "developer") {
            model = Developer; // Use Faculty model for admins or high-authority users
        } else {
            return res.status(401).json({ error: "Authentication token not found" });
        }

        const userData = await model.findById({ _id: userID }).select("-password");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with user data (excluding sensitive fields)
        res.status(200).json({ userData });

    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};


const changePasswordUser = async (req, res, next) => {

    try {
        // const reqBody = await req.json();
        const { id, username, newpassword } = req.body;
        if (!id || !username || !newpassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(newpassword, saltRound);
        const user = await User.findOneAndUpdate(
            { _id: id },
            { password: hash_password },
            { new: true } // This returns the updated user document
        );
        if (!user) {
            return res.status(404).json({ message: "Inavlid Credentials" });
        }

        res.status(200).json({ message: "Password Changed successfully." });
    } catch (error) {
        next(error);
    }


}



module.exports = { home, userRegister, facultyRegister, facultyLogin, userLogin, getCurrentUser, changePasswordUser };