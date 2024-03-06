import express from "express"
import { Router } from "express"
import {register, login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword, verifyUser} from "../controllers/appController.js"
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/registerMail", (req, res) => {
      res.status(201).json({
            success: true,
            message: "Register Mail route",
      })
});
router.post("/authenticate", (req, res) => {
      res.status(201).json({
            success: true,
            message: "Authenticate route",
      })
});
router.post("/login", verifyUser, login);


router.get("/user/:username", getUser);
router.get("/generateOTP", generateOTP);
router.get("/verifyOTP", verifyOTP);
router.get("/createResetSession", createResetSession);


router.put("/updateUser", auth, updateUser);
router.put("/resetPassword", resetPassword);

export default router;