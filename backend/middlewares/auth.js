import jwt from "jsonwebtoken";
import ENV from "../config.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    //retrieve user detail of logged in user
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

    req.user = decodedToken;

    //res.json(decodedToken);

    next();
  } catch (error) {
    res.status(401).json({
      error: "Authentication failed",
    });
  }
};

export const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};
