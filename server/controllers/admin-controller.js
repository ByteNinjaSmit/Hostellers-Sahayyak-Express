require("dotenv").config();
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

// -----------
//  GET ALl Issues
// -------------

const getAllIssues = async (req, res, next) => {
    try {

        // Fetch data from all models and populate the `user` field with `strictPopulate: false`
        const drinkWaterData = await DrinkWater.find().populate({
            path: "user",
            model: "User", // Ensure you explicitly use the User model
            select: "-password",
            options: { strictPopulate: false },
        });

        const roomData = await Room.find().populate({
            path: "user",
            model: "User",
            select: "-password",
            options: { strictPopulate: false },
        });

        const commonAreaData = await CommonArea.find().populate({
            path: "user",
            model: "User",
            select: "-password",
            options: { strictPopulate: false },
        });

        const corridorData = await Corridor.find({}, "-image").populate({
            path: "user",
            model: "User",
            select: "-password",
            options: { strictPopulate: false },
        });

        const foodQualityData = await FoodQuality.find().populate({
            path: "user",
            model: "User",
            select: "-password",
            options: { strictPopulate: false },
        });

        const foodOwnerData = await FoodOwner.find().populate({
            path: "user",
            model: "User",
            select: "-password",
            options: { strictPopulate: false },
        });

        const networkData = await NetworkConn.find().populate({
            path: "user",
            model: "User",
            select: "-password",
            options: { strictPopulate: false },
        });

        const safetyData = await Safety.find().populate({
            path: "user",
            model: "User",
            select: "-password",
            options: { strictPopulate: false },
        });

        // Combine all the arrays into one with categories
        const combinedData = [
            ...drinkWaterData.map((doc) => ({
                ...doc.toObject(),
                category: "Hostel",
            })),
            ...roomData.map((doc) => ({ ...doc.toObject(), category: "Hostel" })),
            ...commonAreaData.map((doc) => ({
                ...doc.toObject(),
                category: "Hostel",
            })),
            ...corridorData.map((doc) => ({ ...doc.toObject(), category: "Hostel" })),
            ...foodQualityData.map((doc) => ({
                ...doc.toObject(),
                category: "Mess / Tiffin",
            })),
            ...foodOwnerData.map((doc) => ({
                ...doc.toObject(),
                category: "Mess / Tiffin",
            })),
            ...networkData.map((doc) => ({
                ...doc.toObject(),
                category: "Facility",
            })),
            ...safetyData.map((doc) => ({
                ...doc.toObject(),
                category: "Security",
            })),
        ];

        // Sort the combined data by `createdAt` in descending order
        combinedData.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        res.set({
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Expires": "0",
            "Pragma": "no-cache"
        });

        // Send the response with the combined data
        return res.status(200).json(combinedData);
    } catch (error) {
        next(error)
    }
}


// --------------
// Get Single issue Of By Issue Id
// -------------

const getIssue = async (req, res) => {
    try {
        // Extract the issueid parameter from the request
        const { issueid } = req.params;

        // Array of models and their respective category names
        const models = [
            { model: DrinkWater, category: "Hostel" },
            { model: Room, category: "Hostel" },
            { model: CommonArea, category: "Hostel" },
            { model: Corridor, category: "Hostel" },
            { model: FoodQuality, category: "Mess / Tiffin" },
            { model: FoodOwner, category: "Mess / Tiffin" },
            { model: NetworkConn, category: "Facility" },
            { model: Safety, category: "Security" },
        ];

        let foundDocument = null;
        let foundCategory = null;

        // Try to fetch data from each model and return the first found document
        for (const { model, category } of models) {
            foundDocument = await model.findById({ _id: issueid }).populate("user", "-password").exec();
            if (foundDocument) {
                foundCategory = category; // Save the found category
                break; // Exit loop once a document is found
            }
        }

        // If no document is found, return a 404 response
        if (!foundDocument) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Return the found document along with the category
        res.status(200).json({ document: foundDocument, category: foundCategory });
    } catch (error) {
        next(error);
    }
}


// --------------
// Update Status Of Issue
// -------------

const updateIssueStatus = async (req, res) => {
    try {

        // Extract the issueid from the request parameters
        const { issueid } = req.params;

        // Extract the status from the request body
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        // Array of models
        const models = [
            DrinkWater,
            Room,
            CommonArea,
            Corridor,
            FoodQuality,
            FoodOwner,
            NetworkConn,
            Safety,
        ];

        let updatedDocument = null;

        // Try to find the document and update the status
        for (const model of models) {
            updatedDocument = await model.findByIdAndUpdate(
                issueid,
                { status: status }, // Update the status
                { new: true } // Return the updated document
            ).exec();

            if (updatedDocument) {
                break; // Exit loop once the document is found and updated
            }
        }

        // If no document was updated, return a 404 response
        if (!updatedDocument) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Return the updated document
        res.status(200).json({ message: "Status updated successfully" });

    } catch (error) {
        next(error);
    }
}

// ----------------
// Update Actions And Status from Admin
// ------------------

const updateIssue = async (req, res) => {
    try {

        // Extract the issueid from the request parameters
        const { issueid } = req.params;

        // Extract the status from the request body
        const { status,actionLog } = req.body;

        if (!status || !actionLog) {
            return res.status(400).json({ error: "All Fields are required" });
        }

        // Array of models
        const models = [
            DrinkWater,
            Room,
            CommonArea,
            Corridor,
            FoodQuality,
            FoodOwner,
            NetworkConn,
            Safety,
        ];

        let updatedDocument = null;

        // Try to find the document and update the status
        for (const model of models) {
            updatedDocument = await model.findByIdAndUpdate(
                {_id:issueid},
                { status: status, actionLog:actionLog }, // Update the status
                { new: true } // Return the updated document
            ).exec();

            if (updatedDocument) {
                break; // Exit loop once the document is found and updated
            }
        }

        // If no document was updated, return a 404 response
        if (!updatedDocument) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Return the updated document
        res.status(200).json({ message: "Complaint Updated successfully" });

    } catch (error) {
        next(error);
    }
}

// ----------------
// GET All Users
//---------------

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 }).exec();
        res.status(200).json(users);
    } catch (error) {
        next(error)
    }
}

// --------------
// GET Single User
// ---------------
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" })
        }
        const user = await User.find({ _id: id }, "-password").exec();
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

// ----------------
// DELETE User
// ---------------

const deleteUser = async (req, res, next) => {
    try {

        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" })
        }
        const user = await User.findByIdAndDelete({ _id: userId }).exec();

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}

// -------------------
// Change Passwowrd Of Of User
//----------------------

const changePasswordUser = async (req, res, next) => {
    try {

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

// --------------
// Update User Details
// -----------------

const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { name, username, room, hostelId, password,face_image } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" })
        }
        if (!name || !username || !room || !hostelId || !password ||!face_image) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const updateData = {};

        // Add fields to updateData only if provided in the request body
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (room) updateData.room = room;
        if (hostelId) updateData.hostelId = hostelId;
        if (face_image) updateData.face_image = face_image;

        // If the password is provided, hash it before updating
        if (password) {
            const saltRound = await bcrypt.genSalt(10);
            const hash_password = await bcrypt.hash(password, saltRound);
            updateData.password = hash_password;
        }
        const updatedUser = await User.findByIdAndUpdate({_id:userId}, updateData, { new: true }).exec();
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json({ message: "User updated successfully" })
    } catch (error) {
        next(error);
    }
}

// ------------------
// GET Users By Hostel
// ------------------

const getHostelUsers = async (req, res, next) => {
    try {
        const { hostelId } = req.params;
        if (!hostelId) {
            return res.status(400).json({ error: "Hostel ID is required" })
        }
        // Query the database for users with the specified hostelId
        const users = await User.find({ hostelId: hostelId }).select('-password -face_image'); // Exclude password from results

        if (!users) {
            return res.status(404).json({ error: "No users found in this hostel" })
        }
        // Return the users as a JSON response
        return res.status(200).json(users)
    } catch (error) {
        next(error);
    }
}

// ----------
// New Save Attendace All Students 
// ----------

const newAttendance = async (req, res, next) => {
    try {

        const body = req.body;

        // Check if an attendance entry for the same date and hostel already exists
        const existingAttendance = await Attendance.findOne({
            date: body.date,
            hostel: body.hostel,
        });

        if (existingAttendance) {
            return res.status(409).json({ error: "Attendance for this date and hostel already exists" });
        }

        // Create a new attendance entry
        const newAttendance = new Attendance({
            date: body.date,
            hostel: body.hostel,
            students: body.students, // Ensure this is an array of student objects
        });

        // Save the new attendance entry to the database
        await newAttendance.save();

        // Return Success Message
        return res.status(201).json({ message: "Attendance saved successfully" });

    } catch (error) {
        next(error);
    }
}

// ----------
// GET All Attendace
// ----------

const getAllAttendance = async (req, res, next) => {
    try {

        const attendanceRecords = await Attendance.find({}).populate({ path: 'students.student', select: '-password', });

        // return
        return res.status(200).json(attendanceRecords);

    } catch (error) {
        next(error);
    }
}

// -----------
// GET Attendance by ID
// -----------
const getAttendanceById = async (req, res, next) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        // Retrieve the attendance record by ID and populate student information without the password field
        const attendanceRecord = await Attendance.findById(id).populate({
            path: 'students.student',
            select: '-password', // Exclude the password field
        }).exec();

        if (!attendanceRecord) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        // Return the attendance record with student information
        return res.status(200).json(attendanceRecord);
    } catch (error) {
        next(error);
    }
}

// ----------------
// Update Attendance
// ----------------
const updateAttendance = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const { students } = req.body;
        if (!students || !Array.isArray(students)) {
            return res.status(400).json({ message: "Invalid data: 'students' should be an array." });
        }

        // Update the attendance record with the new student information
        const updatedAttendance = await Attendance.findByIdAndUpdate(id, { students }, { new: true, runValidators: true }).exec();

        if (!updatedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        // Return the updated attendance record with message
        return res.status(200).json({ message: "Attendance record updated successfully", data: updatedAttendance });
    } catch (error) {
        next(error);
    }
}


// --------------
// PUT Attendance One By One User Data
// --------------
const putAttendanceOneByOneUserData = async (req, res, next) => {
    try {
        const { userId, date, hostelId, status } = req.body;

        // Validate the request data
        if (!userId || !date || !hostelId || !status) {
            return res.status(400).json({ message: "Invalid data" });
        }

        // Parse the date for consistent querying
        const attendanceDate = new Date(date);

        // Find the attendance document for the given date and hostel
        let attendance = await Attendance.findOne({ date: attendanceDate, hostel: hostelId });

        if (!attendance) {
            // If attendance doesn't exist, create a new document
            attendance = new Attendance({
                date: attendanceDate,
                hostel: hostelId,
                students: []
            });
        }

        // Check if the student already exists in the students array
        const studentIndex = attendance.students.findIndex(s => s.student.toString() === userId);

        if (studentIndex > -1) {
            // If the student exists, update their status
            attendance.students[studentIndex].status = status;
        } else {
            // If the student doesn't exist, add them to the students array
            attendance.students.push({
                student:userId,
                status,
                remarks: "", // Default remarks
            });
        }

        // Save the updated attendance document
        await attendance.save();

        // Respond to the client
        return res.status(200).json({message: "Attendance Marked successfully",});
    } catch (error) {
        // Handle errors and pass them to the error-handling middleware
        next(error);
    }
};

// --------------------
// GET Attendance Signle Hostel Of Particular Date
// -------------------
const getSingleHostelDateWise = async (req, res, next) => {
    try {
        const { hostelId, date } = req.params;

        // Validate the parameters
        if (!hostelId || !date) {
            return res.status(400).json({ message: "Hostel and Date are required." });
        }

        // Parse the date to match the stored format
        const attendanceDate = new Date(date);

        // Find the attendance document for the given hostel and date
        const attendance = await Attendance.findOne({ date: attendanceDate, hostel: hostelId });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found for this hostel and date." });
        }

        // Respond with the attendance document
        return res.status(200).json(attendance);
    } catch (error) {
        // Pass any errors to the error-handling middleware
        next(error);
    }
};

module.exports = { 
    updateIssueStatus, 
    getIssue, 
    updateIssue,
    getAllIssues, 
    getUsers, 
    getUser, 
    deleteUser, 
    updateUser, 
    changePasswordUser, 
    getHostelUsers, 
    newAttendance, 
    getAllAttendance, 
    getAttendanceById, 
    updateAttendance,
    putAttendanceOneByOneUserData,
    getSingleHostelDateWise,
};