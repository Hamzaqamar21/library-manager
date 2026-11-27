import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";


const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const {password} = req.body;

        if(!password || password.trim().length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

export default resetPassword;
