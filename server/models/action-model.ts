import mongoose, { Schema, model, Document } from "mongoose";

// Define the interface for the ActionTake document
interface IActionTake extends Document {
  complaintId?: string;
  message: string;
  from: string;
  To: string;
  user?: string;
  highAuth?: string;
  createdAt: string;
  updatedAt: string;
}

// Define the action schema
const actionSchema = new Schema<IActionTake>({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Complaint",  // Assuming you want to reference a "Complaint" model
  },
  message: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  To: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User", // Reference to a "User" model
  },
  highAuth: {
    type: mongoose.Types.ObjectId,
    ref: "Faculties", // Reference to a "Faculties" model
  },
}, { timestamps: true });

// Model initialization
const ActionTake = (() => {
  try {
    // Return the existing model if already compiled
    return model<IActionTake>('ActionTake');
  } catch (error) {
    // Otherwise, define and return the new model
    return model<IActionTake>('ActionTake', actionSchema);
  }
})();
export default ActionTake;
