const router = require("express").Router();

const ApiResult = require('../models/Common/ApiResult');
const VerifyToken = require('./Auth/VerifyToken');
const CartModel = require('../models/Reservation/CartModel');

router.get("/getCart", VerifyToken, async (req, res) => {
    try {
        const resCart = await CartModel.aggregate([
            { $match: { strUserCode: req.objToken.strUserCode } },
            { $unwind: "$arrCartDetails" },
            { $replaceRoot: { newRoot: "$arrCartDetails" } },
            {
                $lookup: {
                    from: "movies",
                    let: { str_movie_code: "$strMovieCode", str_theater_code: "$strTheaterCode", str_time: "$strTimeSlot" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$strMovieCode", "$$str_movie_code"] } } },
                        {
                            $project: {
                                strMovieName: '$strMovieName',
                                objTheater: {
                                    $let: {
                                        vars: {
                                            objTheater: {
                                                $arrayElemAt: [{
                                                    $filter: {
                                                        input: "$arrTheaters",
                                                        as: "theater",
                                                        cond: { $eq: ["$$theater.strTheaterCode", "$$str_theater_code"] }
                                                    }
                                                }, 0]
                                            }
                                        },
                                        in: {
                                            intDblAmount: "$$objTheater.dblAmount",
                                            arrTimeSlots: "$$objTheater.arrTimeSlots",
                                            booAvailable: "$booAvailable",
                                            strMovieName: "$strMovieName"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                intDblAmount: "$objTheater.intDblAmount",
                                booAvailable: "$objTheater.booAvailable",
                                strMovieName: "$objTheater.strMovieName",
                                arrTimeSlots: {
                                    $filter: {
                                        input: "$objTheater.arrTimeSlots",
                                        as: "time",
                                        cond: { $eq: ["$$time", "$$str_time"] }
                                    }
                                }
                            }
                        }
                    ],
                    as: "movie_details"
                }
            },
            { $unwind: { path: "$movie_details", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "theaters",
                    let: { str_theater_code: "$strTheaterCode" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$strTheaterCode", "$$str_theater_code"] } } },
                        { $project: { strTheaterName: "$strTheaterName", strTheaterLocation: "$strTheaterLocation" } }
                    ],
                    as: "theater_details"
                }
            },
            { $unwind: { path: "$theater_details", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    booAvailable: "$movie_details.booAvailable",
                    booTimeSlot: { $cond: { if: { $gt: [{ $size: "$movie_details.arrTimeSlots" }, 0] }, then: true, else: false } }
                }
            },
            {
                $project: {
                    _id: 0,
                    strMovieCode: "$strMovieCode",
                    strMovieName: "$movie_details.strMovieName",
                    intTicketCount: "$intTicketCount",
                    dblAmount: { $multiply: ["$intTicketCount", "$movie_details.intDblAmount"] },
                    strTheaterCode: "$strTheaterCode",
                    strTheaterName: "$theater_details.strTheaterName",
                    strTheaterLocation: "$theater_details.strTheaterLocation",
                    strTimeSlot: "$strTimeSlot"
                }
            }
        ]);

        if (resCart.length > 0) { res.status(200).send(new ApiResult(true, resCart)); }
        else { res.status(200).send(new ApiResult(false, "No Cart Details Found!")); }

    } catch (error) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.post("/addCart", VerifyToken, async (req, res) => {
    try {
        const objCart = await CartModel.findOne({ strUserCode: req.objToken.strUserCode });
        if (objCart) {
            if(objCart.arrCartDetails.filter((obj) => obj.strMovieCode == req.body.objCartDetails.strMovieCode && obj.strTimeSlot == req.body.objCartDetails.strTimeSlot).length == 1) {
                objCart.arrCartDetails.filter((obj) => obj.strMovieCode == req.body.objCartDetails.strMovieCode && obj.strTimeSlot == req.body.objCartDetails.strTimeSlot)[0].intTicketCount += req.body.objCartDetails.intTicketCount;
            } else {
                objCart.arrCartDetails.push(req.body.objCartDetails);
            }
  
            await objCart.save();
            res.status(200).send(new ApiResult(true, `Cart details update successfully. ( User Code: ${req.objToken.strUserCode} )`));
        } else {
            const arrCartDetails = [];
            arrCartDetails.push(req.body.objCartDetails);

            const resSave = await new CartModel({
                strUserCode: req.objToken.strUserCode,
                arrCartDetails: arrCartDetails,
            }).save();

            res.status(200).send(new ApiResult(true, `Cart details saved successfully. ( User Code: ${resSave.strUserCode} )`));
        }
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.put("/editCart", VerifyToken, async (req, res) => {
    try {
        const objCart = await CartModel.findOne({ strUserCode: req.objToken.strUserCode });
        if (objCart) {
            objCart.arrCartDetails.filter((movie) => movie.strMovieCode == req.body.strMovieCode && movie.strTimeSlot == req.body.strTimeSlot)[0].intTicketCount = req.body.intTicketCount;

            await objCart.save();
            res.status(200).send(new ApiResult(true, `Cart details update successfully. ( User Code: ${req.objToken.strUserCode} )`));
        }
        else { res.status(200).send(new ApiResult(false, "No cart details Found!")); }
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.delete("/deleteCart", VerifyToken, async (req, res) => {
    try {
        const objCart = await CartModel.findOne({ strUserCode: req.objToken.strUserCode });
        if (objCart) {
            objCart.arrCartDetails.splice(objCart.arrCartDetails.findIndex((item) => item.strMovieCode == req.body.strMovieCode && item.strTimeSlot == req.body.strTimeSlot), 1);
            await objCart.save();
            res.status(200).send(new ApiResult(true, `Cart details update successfully. ( User Code: ${req.objToken.strUserCode} )`));
        }
        else { res.status(200).send(new ApiResult(false, "No cart details Found!")); }
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

module.exports = router;