const mongoose = require("mongoose");

const hostelAddrSchema = new mongoose.Schema({
    hostelName: {
        type: String,
        required:true,
    },
    longitude:{
        type: Number,
        required:true,
    },
    latitude:{
        type: Number,
        required:true,
    },
    radius:{
        type: Number,
        required:true,
    }
},
{
    timestamps:true
});

const HostelAddress = new mongoose.model("HostelAddress",hostelAddrSchema);
module.exports = HostelAddress;