import { User } from "../Model.js/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../db/nodemailer.js";

export const registerUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body); 

        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
           
            return res.status(400).json({ success: false, message: "Missing required details" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

    
        const hashPassword = await bcrypt.hash(password, 10);

  
        const user = new User({ name, email, password: hashPassword });
        await user.save();

   
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:`Registered Succesfully`,
            text:`Welcome to our website .You are registered to our website with email id:${email}`
        }
        await transporter.sendMail(mailOptions);
           
        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and Password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Logout User
export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const sendOtpVerification = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (user.isAccountVerified) {
            return res.json({ success: false, message: `User already verified` });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `OTP Verification`,
            text: `User OTP ${otp} for Account verification`
        };
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: `OTP sent succesfully` });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        res.json({ success: false, message: `userId and otp is required` });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.json({ success: false, message: `User doesn't exists` });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            res.json({ success: false, message: `Invalid OTP` });
        }
        if (user.verifyOtpExpiredAt < Date.now()) {
            res.json({ success: false, message: `OTP has been expired` });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        await user.save();
        return res.json({ success: true, message: `Email verified Succesfully` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
export const isAuthenticated=async(req,res)=>{
    try {
        return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

export const sendResetOtp=async(req,res)=>{
    const {email}=req.body
    if(!email){
        return res.json({success:false,message:`Provide Valid emailId`})
    }
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false,message:`User not exists`})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15* 60 * 1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Reset OTP`,
            text: `Your reset OTP is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        return res.json({success:true,message:`OTP sent successfully`})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body;
    if(!email || !otp ||! newPassword){
        return res.json({success:false,message:`Email,otp and new Password are required to reset the password`})
    }
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.json({success:false,message:`User not found`})
        }
        if(user.resetOtp===''|| user.resetOtp!==otp){
            return res.json({success:false,message:`Invalid OTP`})
        }
        if(user.resetOtpExpiredAt<Date.now()){
            return res.json({success:false,message:`OTP has been expired`})
        }
        const hashPassword=await bcrypt.hash(newPassword,10);
        user.password=hashPassword
        user.resetOtp=''
        user.resetOtpExpiredAt=0
        await user.save()
        return res.json({success:true,message:"Password has been reset succesfully"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

