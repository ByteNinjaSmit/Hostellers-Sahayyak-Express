require("dotenv").config();
const DrinkWater = require("../models/drink-water-model");
const Room = require("../models/room-model");
const CommonArea = require("../models/commonArea-model");
const Corridor = require("../models/corridor-model");
const FoodQuality = require("../models/food-quality-model");
const FoodOwner = require("../models/food-owner-model");
const NetworkConn = require("../models/network-model");
const Safety = require("../models/safety-model");



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
        const { user } = req.params;

        // Fetch data from all models where `user` matches the provided user
        const drinkWaterData = await DrinkWater.find({ user: user });
        const roomData = await Room.find({ user: user });
        const commonAreaData = await CommonArea.find({ user: user });
        const corridorData = await Corridor.find({ user: user });
        const foodQualityData = await FoodQuality.find({ user: user });
        const foodOwnerData = await FoodOwner.find({ user: user });
        const networkData = await NetworkConn.find({ user: user });
        const safetyData = await Safety.find({ user: user });

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


module.exports = { newIssue, getIssuesAllUser, getIssue, deleteIssue, updateIssueStatus,getUser };