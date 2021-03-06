const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const foundUser = await db.User.findOne({ email: req.body.email });

    if (foundUser)
      return res.status(400).json({
        status: 400,
        message: "Email address has already been registered. Please try again",
      });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const createdUser = await db.User.create({ ...req.body, password: hash });

    return res.status(201).json({ status: 201, message: "success", createdUser });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong. Please try again",
    });
  }
};

const login = async (req, res) => {
  try {
    const foundUser = await db.User.findOne({ email: req.body.email }).select(
      "+password"
    ).populate('feeds').exec()

    // await foundUser.populate('feeds').exec()

    if (!foundUser) {
      return res.status(400).json({ status: 400, message: "Username or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
    // check if the passwords match
    if (isMatch) {
      //TODO create a json web token and send response
      // .sign(payload,secretkey,options)
      const signedJwt = await jwt.sign(
        { _id: foundUser._id },
        "supersecretwaffels",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        status: 200,
        message: "Success",
        // token: signedJwt,
        user: foundUser
      });
    } else {
      // the password provided does not match the password on file.
      return res.status(400).json({
        status: 400,
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong. Please try again",
    });
  }
};

const profile = async (req, res) => {
  try {
    const foundUser = await db.User.findById(req.currentUser).populate('feeds').exec();

    res.json({ headers: req.headers, user: foundUser });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong. Please try again",
    });
  }
};

module.exports = {
  register,
  login,
  profile,
};
