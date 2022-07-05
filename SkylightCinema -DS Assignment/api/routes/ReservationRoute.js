const router = require("express").Router();

const ApiResult = require('../models/Common/ApiResult');
const VerifyToken = require('./Auth/VerifyToken');
const ReservationModel = require('../models/Reservation/ReservationModel');
const CartModel = require('../models/Reservation/CartModel');
const UserModel = require('../models/User/UserModel');

const sendReservationMail = require('../models/Common/NodeMailer');
const client = require('twilio')("AC7a1e0939de604287ae78feb05fac1f3e", "72bcb00b69f467e88f97c31d7e5f6606");

router.get("/getReservation", VerifyToken, async (req, res) => { 
    try {
        const arrReservations = await ReservationModel.find({ strUserCode: req.objToken.strUserCode }, { _id: 0, __v : 0 });
        
        if(arrReservations.length > 0) { res.status(200).send(new ApiResult(true, arrReservations));}
        else { res.status(200).send(new ApiResult(false, "No Reservation Details Found!")); }
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.post("/addReservation", VerifyToken, async (req, res) => { 
    try {
        const resSave = await new ReservationModel({
            strReservationCode: "RESV" + Date.now().toString().substring(7, 13),
            strUserCode: req.objToken.strUserCode,
            arrMovieReservation: req.body.arrMovieReservation,
            objPaymentDetails: req.body.objPaymentDetails
        }).save();

        await CartModel.findOneAndUpdate(
            { strUserCode: req.objToken.strUserCode },
            { arrCartDetails: [] }
        );

        // client.messages
        //     .create({
        //         body: `Your order has been successfully placed. ( Reservation Code: ${resSave.strReservationCode} )`,
        //         from: '+18644005424', 
        //         to: '+94766858031'
        //     })
        //     .then(message => console.log(message.sid));

        const resUser = await UserModel.findOne({ strUserCode: req.objToken.strUserCode }, { strUserEmail: 1 })

        sendReservationMail(resUser.strUserEmail, resSave.strReservationCode);

        res.status(200).send(new ApiResult(true, `Reservation saved successfully. ( Reservation Code: ${resSave.strReservationCode} )`));
        
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

router.put("/cancelReservation", VerifyToken, async (req, res) => { 
    try {
        const objReservation = await ReservationModel.findOne({ strReservationCode: req.body.strReservationCode });

        if(objReservation) {
            objReservation.booCancel = true;
            objReservation.strCancelRemark = req.body.strCancelRemark;

            await objReservation.save();
            res.status(200).send(new ApiResult(true, `Reservation cancel successfully. ( Reservation Code: ${req.body.strReservationCode} )`));
        } else { res.status(200).send(new ApiResult(false, "No reservation details Found!")); }        
    } catch (err) {
        res.status(400).send(new ApiResult(false, err.message));
    }
});

module.exports = router;