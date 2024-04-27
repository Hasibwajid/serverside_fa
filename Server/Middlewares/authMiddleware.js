import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    console.log("Token received:", req.headers.authorization);

    const decode = JWT.verify(
      req.headers.authorization, //get token
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// Is client
export const isClient = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role == "client") {
      next();
    } else {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    }
  } catch (err) {
    res.status(401).send({
      success: false,
      err,
      message: "Error in client middleware",
    });
  }
};

// IS freelancer
export const isFreelancer = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role == "freelancer") {
      next();
    } else {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    }
  } catch (err) {
    res.status(401).send({
      success: false,
      err,
      message: "Error in freelancer middleware",
    });
  }
};
