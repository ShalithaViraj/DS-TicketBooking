const router = require("express").Router();

const ApiResult = require('../models/Common/ApiResult');
const VerifyToken = require('./Auth/VerifyToken');
const TheaterModel = require('../models/Movie/TheaterModel');

router.get("/getAllTheates", VerifyToken, async (req, res) => { 
    try {
        const resAllTheates = await TheaterModel.find({ }, { _id: 0, __v: 0 });
        
        if(resAllTheates.length > 0) { res.status(200).send(new ApiResult(true, resAllTheates)); }
        else { res.status(200).send(new ApiResult(false, "No Theates Found!")); }

    } catch (error) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.post("/addTheater", VerifyToken, async (req, res) => {
    try {
        const resSave = await new TheaterModel({
            strTheaterCode: "THEA" + Date.now().toString().substring(7, 13),
            strTheaterName: req.body.strTheaterName,
            strTheaterLocation: req.body.strTheaterLocation
        }).save();

        res.status(200).send(new ApiResult(true, `Theater create successfully. ( Theater Code: ${resSave.strTheaterCode} )`));
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.put("/editTheater", VerifyToken, async (req, res) => {
    try {
        const objTheater = await TheaterModel.findOne({ strTheaterCode: req.body.strTheaterCode });
        if(objTheater) { 
            objTheater.strTheaterName = req.body.strTheaterName;
            objTheater.strTheaterLocation = req.body.strTheaterLocation;

            await objTheater.save();
            res.status(200).send(new ApiResult(true, `Theater update successfully. ( Theater Code: ${objTheater.strTheaterCode} )`));
        }
        else { res.status(200).send(new ApiResult(false, "No Theates Found!")); }
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.delete("/deleteTheater", VerifyToken, async (req, res) => {
    try {
        await TheaterModel.deleteOne({ strTheaterCode: req.body.strTheaterCode });
        res.status(200).send(new ApiResult(true, `Theater delete successfully. ( Theater Code: ${req.body.strTheaterCode} )`));
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

module.exports = router;