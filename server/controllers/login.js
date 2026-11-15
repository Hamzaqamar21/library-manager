import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please provide all required fields"});
    }
    const user = await User.findOne({email:email.trim().toLowerCase()});
    if(!user){
        return res.status(401).json({message:"Invalid email or password"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid email or password"});
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
    res.status(200).json({message:"Login successful",token,user:{id:user._id,name:user.name,email:user.email,role:user.role }});        
    }catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({message:"Server error"});
    }
}

export default login;