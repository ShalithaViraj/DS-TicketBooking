const router = require("express").Router();
const path = require('path');
const fs = require('fs').promises;

const ApiResult = require('../models/Common/ApiResult');
const VerifyToken = require('./Auth/VerifyToken');
const MovieModel = require("../models/Movie/MovieModel");

router.get("/getAllMovies", async (req, res) => { 
    try {
        const resAllMovies = await MovieModel.aggregate([
            {
                $lookup: {
                    from: "theaters",
                    pipeline: [
                        { $project: { strTheaterCode: 1, strTheaterName: 1, strTheaterLocation: 1 } }
                    ],
                    as: "theater_details"
                }
            },
            {
                $project: {
                    _id: 0,
                    strMovieCode: 1,
                    strMovieName: 1,
                    strMovieDesc: 1,
                    strMovieIMDB: 1,
                    strMovieRunTime: 1,
                    strMovieTrailer: 1,
                    strMoviePosterImg: 1,
                    booAvailable: 1,
                    arrTheaters: {
                        $map: {
                            input: "$arrTheaters",
                            as: "theater",
                            in: {
                                $let: {
                                  vars: {
                                    objTheater: {
                                        $arrayElemAt: [ { $filter: {
                                          input: "$theater_details",
                                          as: "item",
                                          cond: { $eq: ["$$theater.strTheaterCode", "$$item.strTheaterCode"] }
                                        } } ,0]
                                    }
                                  },
                                  in: {
                                      $mergeObjects: [ { strTheaterLocation: "$$objTheater.strTheaterLocation" }, "$$theater" ],
                                    //   strK : "$$theater"
                                  }
                                }
                            }
                        }
                    }
                }
            }
        ]);
        
        if(resAllMovies.length > 0) { res.status(200).send(new ApiResult(true, resAllMovies)); }
        else { res.status(200).send(new ApiResult(false, "No Movies Found!")); }

    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.post("/addMovie", VerifyToken, async (req, res) => {
    try {
        if (req.files.PosterImg) {
            const strMovieCode = "MOV" + Date.now().toString().substring(6, 13);

            const resSave = await new MovieModel({
                strMovieCode: strMovieCode,
                strMovieName: req.body.strMovieName,
                strMovieDesc: req.body.strMovieDesc,
                strMovieIMDB: req.body.strMovieIMDB,
                strMovieRunTime: req.body.strMovieRunTime,
                strMovieTrailer: req.body.strMovieTrailer,
                strMoviePosterImg: `/MoviePosters/${strMovieCode + "-poster.jpg"}`,
                arrTheaters: JSON.parse(req.body.arrTheaters),
                booAvailable: true
            }).save();

            if(resSave.strMovieCode) { 
                await req.files.PosterImg.mv(path.resolve(`./public/MoviePosters/${strMovieCode + "-poster.jpg"}`));
                res.status(200).send(new ApiResult(true, `Movie create successfully. ( Movie Code: ${resSave.strMovieCode} )`));
            } else {
                res.status(200).send(new ApiResult(false, resSave.message));
            }
        }
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.put("/editMovie", VerifyToken, async (req, res) => {
    try {
        if (req.files.PosterImg) {
            await fs.unlink(path.resolve(`./public/MoviePosters/${req.body.strMovieCode + "-poster.jpg"}`));
            await req.files.PosterImg.mv(path.resolve(`./public/MoviePosters/${req.body.strMovieCode + "-poster.jpg"}`));
        }

        const objMovie = await MovieModel.findOne({ strMovieCode: req.body.strMovieCode });
        if(objMovie) {
            objMovie.strMovieName = req.body.strMovieName;
            objMovie.strMovieDesc = req.body.strMovieDesc;
            objMovie.strMovieIMDB = req.body.strMovieIMDB;
            objMovie.strMovieRunTime = req.body.strMovieRunTime;
            objMovie.strMovieTrailer = req.body.strMovieTrailer;
            objMovie.arrTheaters = JSON.parse(req.body.arrTheaters);
            objMovie.booAvailable = req.body.booAvailable;

            await objMovie.save();
            res.status(200).send(new ApiResult(true, `Movie update successfully. ( Movie Code: ${req.body.strMovieCode} )`));
        }
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.delete("/deleteMovie", VerifyToken, async (req, res) => {
    try {
        await MovieModel.deleteOne({ strMovieCode: req.body.strMovieCode });
        await fs.unlink(path.resolve(`./public/MoviePosters/${req.body.strMovieCode + "-poster.jpg"}`));
        res.status(200).send(new ApiResult(true, `Movie delete successfully. ( Movie Code: ${req.body.strMovieCode} )`));
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

module.exports = router;