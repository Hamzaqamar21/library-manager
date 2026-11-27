import User from "../models/User.js";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../config/mailer.js";

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email?.trim()){
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        const message = "If an account with that email exists, a password reset link has been sent.";
        if (!user) {
            return res.status(200).json({ message });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 15*60*1000; 
        
        await user.save();
        try {
            await sendResetPasswordEmail(user, resetToken);
        }catch (emailError) {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            console.error("Error sending reset password email:", emailError);
            return res.status(500).json({ message: "Error sending reset password email" });
        }
        res.status(200).json({ message });

    }catch (error) {
        console.error("Forgot password error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


export default forgotPassword;