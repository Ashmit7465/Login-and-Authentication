import express from "express";
import { Router } from "express";
import {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  verifyUser,
} from "../controllers/appController.js";
import { auth } from "../middlewares/auth.js";
import { localVariables } from "../middlewares/auth.js";
import { registerMail } from "../controllers/mail.js";

const router = Router();

router.post("/register", register);
router.post("/registerMail", registerMail);
router.post("/authenticate", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Authenticate route",
  });
});
router.post("/login", verifyUser, login);

router.get("/user/:username", getUser);
router.get("/generateOTP", verifyUser, localVariables,  generateOTP);
router.get("/verifyOTP", verifyOTP);
router.get("/createResetSession", createResetSession);

router.put("/updateUser", auth, updateUser);
router.put("/resetPassword", verifyUser, resetPassword);

export default router;
