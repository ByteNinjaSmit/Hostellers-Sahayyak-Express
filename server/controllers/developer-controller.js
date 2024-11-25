require("dotenv").config();
const Developer = require("../models/developer-model");


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



module.exports = {developerRegister,developerLogin };