const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
    strTheaterCode: {
        type: String,
        unique: true,
        required: true,
        max: 10,
    },
    strTheaterName: {
        type: String,
        required: true,
    },
    strTheaterLocation: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Theaters", theaterSchema);