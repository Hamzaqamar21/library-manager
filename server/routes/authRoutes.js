import express from "express";
import signup from "../controllers/signup.js";
import login from "../controllers/login.js";

import forgotPassword from "../controllers/forgotPassword.js";
import resetPassword from "../controllers/resetPassword.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;