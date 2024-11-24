import mongoose, { Schema,model } from "mongoose";
const inboxSchema = new Schema({
    message:{
        type:String,
        required:true,
        // Description Long
    },
    from:{
        type:String,
        required:true,
        // Role
    },
    To:{
        type:String,
        required:true,
        // role
    },
    user: {
        type: mongoose.Types.ObjectId, 
        ref: "User", 
    },
    highAuth:{
        type: mongoose.Types.ObjectId, 
        ref: "Faculties", 
    }

},
{ timestamps: true }
);

const Inbox = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('Inbox');
    } catch {
      // Otherwise, define and return the new model
      return model('Inbox',inboxSchema);
    }
  })();

// const Inbox =model('Inbox',inboxSchema);                                   
export default Inbox;
