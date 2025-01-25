require("dotenv").config();
const DrinkWater = require("../models/drink-water-model");
const Room = require("../models/room-model");
const CommonArea = require("../models/commonArea-model");
const Corridor = require("../models/corridor-model");
const FoodQuality = require("../models/food-quality-model");
const FoodOwner = require("../models/food-owner-model");
const NetworkConn = require("../models/network-model");
const Safety = require("../models/safety-model");
const User = require("../models/user-model");
const Attendance = require("../models/attendance-model");
const HostelAddress = require("../models/hostel-location-model");

// Set up storage engine (default to memory storage)


// -----------------
// New Issue raise
// -----------------

const newIssue = async (req, res, next) => {
    try {
        const { user, issue } = req.params;
        const { relevantData, foodownerName, foodServiceType, image } = req.body;

        // Helper function to validate relevantData
        const isValidComplaint = (relevantData) => {
            return (
                Array.isArray(relevantData) &&
                relevantData.length > 0 &&
                relevantData.every((item) => item.length >= 2)
            );
        };

        // Validate relevantData
        if (!isValidComplaint(relevantData)) {
            return res.status(400).json({
                error: "Please enter a valid complaint.",
            });
        }

        let msg = ""; // Variable to hold the success message

        // Process the complaints based on the issue type
        switch (issue) {
            case "drinkingwater":
                await DrinkWater.create({ complaint: relevantData, user });
                msg = "Drink-Water Raised Grievance.";
                break;

            case "room":
                await Room.create({ complaint: relevantData, user });
                msg = "Room Raised Grievance.";
                break;

            case "corridor":
                await Corridor.create({
                    complaint: relevantData,
                    user,
                    image,
                });
                msg = "Corridor Raised Grievance.";
                break;

            case "commonarea":
                await CommonArea.create({ complaint: relevantData, user });
                msg = "Common Area Raised Grievance.";
                break;

            case "foodquality":
                await FoodQuality.create({
                    complaint: relevantData,
                    foodOwner: foodownerName,
                    service: foodServiceType,
                    user,
                });
                msg = "Food Quality Raised Grievance.";
                break;

            case "foodowner":
                await FoodOwner.create({
                    complaint: relevantData,
                    foodOwner: foodownerName,
                    service: foodServiceType,
                    user,
                });
                msg = "Food Owner Raised Grievance.";
                break;

            case "wifiissues":
                await NetworkConn.create({
                    complaint: relevantData,
                    user,
                });
                msg = "Network Issue Raised Grievance.";
                break;

            case "security":
                await Safety.create({ complaint: relevantData, user });
                msg = "Security Issue Raised Grievance.";
                break;

            default:
                return res.status(404).json({
                    error: "Not Found Your Issue.",
                });
        }

        // If the grievance is successfully created, send a success response
        return res.status(200).json({ msg });
    } catch (error) {
        console.error("Error To Raise Grievance:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


// ----------------
// Get All Issue Of User
// ------------------

const getIssuesAllUser = async (req, res, next) => {
    try {
        // Extract the user parameter from the request
        const { userId } = req.params;

        // Fetch data from all models where `user` matches the provided user
        const drinkWaterData = await DrinkWater.find({ user: userId }).select('-actionLog -image');
        const roomData = await Room.find({ user: userId }).select('-actionLog -image');
        const commonAreaData = await CommonArea.find({ user: userId }).select('-actionLog -image');
        const corridorData = await Corridor.find({ user: userId }).select('-actionLog -image');
        const foodQualityData = await FoodQuality.find({ user: userId }).select('-actionLog -image');
        const foodOwnerData = await FoodOwner.find({ user: userId }).select('-actionLog -image');
        const networkData = await NetworkConn.find({ user: userId }).select('-actionLog -image');
        const safetyData = await Safety.find({ user: userId }).select('-actionLog -image');

        // Combine all the arrays into one with categories
        const combinedData = [
            ...drinkWaterData.map(doc => ({ ...doc.toObject(), category: 'Hostel' })),
            ...roomData.map(doc => ({ ...doc.toObject(), category: 'Hostel' })),
            ...commonAreaData.map(doc => ({ ...doc.toObject(), category: 'Hostel' })),
            ...corridorData.map(doc => ({ ...doc.toObject(), category: 'Hostel' })),
            ...foodQualityData.map(doc => ({ ...doc.toObject(), category: 'Mess / Tiffin' })),
            ...foodOwnerData.map(doc => ({ ...doc.toObject(), category: 'Mess / Tiffin' })),
            ...networkData.map(doc => ({ ...doc.toObject(), category: 'Facility' })),
            ...safetyData.map(doc => ({ ...doc.toObject(), category: 'Security' })),
        ];

        // Sort the combined data by `createdAt` in descending order
        combinedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Return the sorted combined data
        res.status(200).json(combinedData);
    } catch (error) {
        next(error);
    }
}


// Get Single issue Of By Issue Id

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
// Delete Issue
// -------------

const deleteIssue = async (req, res) => {
    try {
        // Extract the issueid parameter from the request
        const { issueid } = req.params;

        // Array of models to check for the document
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

        // Iterate through each model to find and delete the document
        for (const model of models) {
            const deletedDocument = await model.findByIdAndDelete({ _id: issueid }).exec();
            if (deletedDocument) {
                return res.status(200).json({ message: "Document deleted successfully" });
            }
        }

        // If no document is found to delete, return a 404 response
        return res.status(404).json({ error: "Document not found" });
    } catch (error) {
        next(error);
    }
}

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

// ---------------------
// GET User Image
// --------------------

const getUserImage = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" })
        }
        const user = await User.find({ _id: userId }).select('face_image').exec();
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}

// ----------------------
// Store User Image PATCH
// -----------------------

const storeUserImage = async (req, res, next) => {
    try {
        const { userId, image } = req.body;
        if (!userId || !image) {
            return res.status(400).json({ error: "User ID and Image are required" })
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, { $set: { face_image: image } }, { new: true }).exec();
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        return res.status(200).json({ message: "Image Successfully Stored" });
    } catch (error) {
        next(error);
    }
}

const getAttendance = async (req, res, next) => {
    try {
        const { id } = req.params; // User ID from params
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Find all attendance records where the user is part of the students array
        const attendanceRecords = await Attendance.find({
            "students.student": id, // Filter for entries where the user exists in the students array
        })
            .select("date students -_id");

        // Map and filter the attendance data to return only the user's status and remarks
        const userAttendance = attendanceRecords.map((record) => {
            const studentData = record.students.find(
                (student) => student.student._id.toString() === id
            );
            return {
                date: record.date,
                status: studentData?.status,
                remarks: studentData?.remarks,
            };
        });

        return res.status(200).json(userAttendance);
    } catch (error) {
        next(error); // Pass the error to the global error handler
    }
};


// Getting Hostel Location Address

// Get Location of hostel
const getHostelLocation = async (req, res, next) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ message: "Hostel name is required." })
        }
        const hostel = await HostelAddress.findOne({ hostelName: name })
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found." })
        }
        return res.status(200).json(hostel);
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
        if (status !== "Present" || status !== "Leave") {
            return res.status(400).json({ message: "Invalid status" });
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
                student: userId,
                status,
                remarks: "", // Default remarks
            });
        }

        // Save the updated attendance document
        await attendance.save();

        // Respond to the client
        return res.status(200).json({ message: "Attendance Marked successfully", });
    } catch (error) {
        // Handle errors and pass them to the error-handling middleware
        next(error);
    }
};

const getTodaysAttendance = async (req, res, next) => {
    try {
        const { id, curentdate,name } = req.params;

        if (!id || !curentdate ||!name) {
            return res.status(400).json({ error: "User ID and Date are required" });
        }

        // Parse the date to ensure it's in the correct format
        // const formattedDate = new Date(date).toISOString().slice(0, 10); // Format as YYYY-MM-DD

        // Find the attendance for the user on the specified date
        const attendance = await Attendance.findOne({
            "students.student": id,
            date: curentdate, // Range for today's date
            hostel:name,
        });

        if (!attendance) {
            return res.status(404).json({ error: "Attendance not found for this user on today's date" });
        }

        // Check the student's attendance status
        const studentAttendance = attendance.students.find(student => student.student.toString() === id);

        if (!studentAttendance) {
            return res.status(404).json({ error: "Attendance record for this student not found" });
        }

        // If the status is 'Present' or 'Leave', return true or false respectively
        const isPresent = studentAttendance.status === "Present";

        return res.json({ isPresent });

    } catch (error) {
        next(error);
    }
};




module.exports = { newIssue, getIssuesAllUser, getIssue, deleteIssue, updateIssueStatus, getUser, getUserImage, storeUserImage, getAttendance, getHostelLocation, putAttendanceOneByOneUserData,getTodaysAttendance };