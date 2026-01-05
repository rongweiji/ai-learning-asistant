import jwt from "jsonwebtoken";
import User from "../models/User.js";


// generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
}


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // check if user exists
        const userExists = await User.findOne({ $or: [{ email }]});
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: userExists.email===email ? 'Email already in use' : 'Username already in use',
                statusCode: 400
            });
        }   

        // create user
        const user = await User.create({
            username,
            email,
            password
        });

        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            data: {
                user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                },
                token
            },
            message: 'User registered successfully',
        });

    }catch (error) {
        next(error);
    }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // validate input 
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password',
                statusCode: 400
            });
        }
        // check for user existing or not( include password field for comparison)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return  res.status(401).json({
                success: false,
                error: 'Invalid email or password',
                statusCode: 401
            });
        }

        // check password match
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                statusCode: 401
            });
        }

        //then user existed and password match, then  generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            
            },token,
            message: 'User logged in successfully'
        }); 

    }catch (error) {
        next(error);
    }
}


// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
    
    }catch (error) {
        next(error);
    }
};


// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
    
    }catch (error) {
        next(error);
    }
};

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {   
        try {
    
    }catch (error) {
        next(error);
    }
};
