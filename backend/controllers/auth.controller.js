
import {User} from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../mailtrap/sendVerificationEmail.js';

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

        await user.save(); //  save 

        generateTokenAndSetCookie(res, user._id); // sets cookie

        // Send verification email (non-blocking)
        try {
            await sendVerificationEmail({ email: user.email, verificationToken });
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError.message);
            // Continue signup even if email fails
        }

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

}