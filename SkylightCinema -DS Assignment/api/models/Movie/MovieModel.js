const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    strMovieCode: {
        type: String,
        unique: true,
        required: true,
        max: 10,
    },
    strMovieName: {
        type: String,
        required: true,  
        min: 5    
    },
    strMovieDesc: {
        type: String,
        required: true,  
    },
    strMovieIMDB: {
        type: String,
        required: true,  
    },
    strMovieRunTime: {
        type: String,
        required: true,  
    },
    strMovieTrailer: {
        type: String,
        required: true,  
    },
    strMoviePosterImg: {
        type: String,
        required: true,  
    },
    arrTheaters: [
        {
            strTheaterCode: {
                type: String,
                required: true,  
            },
            arrTimeSlots: [],
            dblAmount: { type: Number, required: true }
        }
    ],
    dtmCreatedDate: {
        type: Date,
        default: Date.now
    },
    booAvailable: {
        type: Boolean,
        required: true,
        default: true  
    },
});

module.exports = mongoose.model("Movies", movieSchema);