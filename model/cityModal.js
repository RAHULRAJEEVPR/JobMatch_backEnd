const mongoose = require("mongoose");

const citysSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

const citysModel = mongoose.model("citys", citysSchema);
module.exports = citysModel;
