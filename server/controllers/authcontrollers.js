import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// REGISTER
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({ username, email, password });

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            token, // JWT token
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('REGISTER ERROR:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            code: error.code
        });
        
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: Object.values(error.errors)[0].message });
        }
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('LOGIN ERROR:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
