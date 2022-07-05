const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ApiResult = require('../models/Common/ApiResult');
const UserModel = require("../models/User/UserModel");

router.post("/register", async (req, res) => {
  try {
    // Check email is already used
    const emailExist = await UserModel.findOne({ strUserEmail: req.body.strUserEmail });
    if (emailExist) return res.status(400).send(new ApiResult(false, "Email is already registered!"));

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.strUserPassword, salt);

    // Save User
    const user = await new UserModel({
      strUserCode: "CUST" + Date.now().toString().substring(7, 13),
      strUserName: req.body.strUserName,
      strUserPassword: hashPassword,
      strUserEmail: req.body.strUserEmail,
      strUserMobile: req.body.strUserMobile,
      arrCartDetails: [],
      strUserRole: 'USER'
    }).save();

    res.status(200).send(new ApiResult(true, `User create successfully. ( User Code: ${user.strUserCode} )`));

  } catch (err) {
    res.status(400).send(new ApiResult(false, err.message));
  }

});

router.post("/signin", async (req, res) => {
  try {
    // Check email is already used
    const userExist = await UserModel.findOne({ strUserEmail: req.body.strUserEmail });
    if (!userExist) return res.status(400).send(new ApiResult(false, "Email or password is wrong. Please try again!"));

    // Check password
    const validPassword = await bcrypt.compare(req.body.strUserPassword, userExist.strUserPassword);

    if (!validPassword) return res.status(400).send(new ApiResult(false, "Email or password is wrong. Please try again!"));
    
    // Create and assign token to the user
    const token = jwt.sign({ strUserCode: userExist.strUserCode, strUserRole: userExist.strUserRole }, process.env.APP_SECRET, { expiresIn: "2h"});

    const objUser = {
        strUserName: userExist.strUserName,
        strUserRole: userExist.strUserRole,
        strToken: token,
    }

    res.status(200).send(new ApiResult(true, objUser));

  } catch (err) {
    res.status(400).send(new ApiResult(false, err.message));
  }

});

module.exports = router;