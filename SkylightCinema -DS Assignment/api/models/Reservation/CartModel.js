const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    strUserCode: {
        type: String,
        unique: true,
        required: true,
        max: 10,
    },
    arrCartDetails: [
        {
            strMovieCode: {
                type: String,
                required: true,
                max: 10,
            },
            intTicketCount: {
                type: Number,
                required: true,  
            },
            strTheaterCode: {
                type: String,
                required: true,
                max: 10,
            },
            strTimeSlot: {
                type: String,
                required: true,  
            }
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);