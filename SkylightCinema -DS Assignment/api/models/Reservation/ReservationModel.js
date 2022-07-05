const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    strReservationCode: {
        type: String,
        unique: true,
        required: true,
        max: 10,
    },
    strUserCode: {
        type: String,
        required: true,
        max: 10,
    },
    arrMovieReservation: [
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
            dblAmount: {
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
    ],
    objPaymentDetails: {
        type: Object,
        required: true
    },
    dtmCreatedDate: {
        type: Date,
        default: Date.now
    },
    booCancel: {
        type: Boolean,
        required: true,
        default: false
    },
    strCancelRemark: {
        type: String
    }
});

module.exports = mongoose.model("Reservation", reservationSchema);