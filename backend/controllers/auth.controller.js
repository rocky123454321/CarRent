
import {User} from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/sendVerificationEmail.js';

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        //new user

        const user = new User({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationTokenExpiredAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day
        });

        await user.save(); 

        generateTokenAndSetCookie(res, user._id); 

        
            await sendVerificationEmail({ email: user.email, verificationToken });

        res.status(201).json({
            success: true,
            message: "User created successfully. Please check your email for verification code.",
            user: {
                ...user._doc,
                password: undefined,
            },
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const verifyEmail = async (req , res)=>{
    const { code } = req.body;

    try{
        const user = await User.findOne({ 
            verificationToken: code ,
            verificationTokenExpiredAt: {$gt: Date.now()}});


            if(!user){
                return res.status(400).json({ message: "Invalid verification code" });
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiredAt = undefined;
            await user.save();

                await sendWelcomeEmail({ email: user.email, name: user.name });
            

            res.status(200).json({
                success: true,
                message: "Email verified successfully",
                user:{
                ...user._doc,
                password: undefined
                }
            });

    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
    

}

export const login = async (req , res)=>{
     const { email, password } = req.body;

     try{
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

         const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


         

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
         if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

            generateTokenAndSetCookie(res, user._id); 
            user.lastLogin = new Date()
            await user.save()


           res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined,
            },
        });


     }catch(error){
        console.log(error);
        res.status(500).json({ message: "Server error" });
     }
  
}

export const logout = async (req , res)=>{
res.clearCookie("token")
res.status(200).json({success: true , message:"logged out successfully"})
}
