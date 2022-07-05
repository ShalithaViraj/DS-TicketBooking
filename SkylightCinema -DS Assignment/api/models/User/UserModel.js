const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    strUserCode: {
        type: String,
        unique: true,
        required: true,
        max: 10,
    },
    strUserName: {
        type: String,
        required: true,  
        min: 5    
    },
    strUserPassword: {
        type: String,
        required: true,  
    },
    strUserEmail: {
        type: String,
        required: true,      
    },
    strUserMobile: {
        type: String,
        required: true,   
        max: 10   
    },
    arrCartDetails: [
        {
            strMovieCode: {
                type: String,
                required: true,
                max: 10,
            },
            strMovieDesc: {
                type: String,
                required: true,
                max: 10,
            },
            strTimeSlot: {
                type: String,
                required: true,
                max: 10,
            },
            intCount: {
                type: Number,
                required: true
            }
        }
    ],
    dtmCreatedDate: {
        type: Date,
        default: Date.now
    },
    strUserRole: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: true  
    },
});

module.exports = mongoose.model("Users", userSchema);