import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
   try {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"Please provide all required fields"});
    }

    if(password.length < 6){
        return res.status(400).json({message:"Password must be at least 6 characters long"});
    }

    const existingUser = await User.findOne({email:email.trim().toLowerCase()});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({name,email:email.trim().toLowerCase(),password:hashedPassword});
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});

    res.status(201).json({message:"Signup successful",token,user:{id:user._id,name:user.name,email:user.email,role:user.role }});

   }catch (error) {
    console.error("Signup error:", error.message);
    if(error.code === 11000){
        return res.status(400).json({message:"Email already exists"});
    }
    res.status(500).json({message:"Server error"});
   }


};

export default signup;
