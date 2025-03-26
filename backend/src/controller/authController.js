import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { dicebearStyles } from '../constants/lists.js';

const generateToken = async (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '10d',
    });
};

const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).send('All fields are required');
        }
        // Check if user already exists
        const existingUsername = await User.findOne({ userName: userName });
        if (existingUsername) {
            return res.status(400).send('Username already exists');
        }
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).send('Email already exists');
        }
        // Check if password is valid
        if (password.length < 6) {
            return res.status(400).send('Password must be at least 6 characters long');
        }
        // Check if email is valid
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).send('Email is not valid');
        }
        // Check if username is valid
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(userName)) {
            return res.status(400).send('Username is not valid');
        }

        //generate profile image random randomly select a style
        const randomStyle = dicebearStyles[Math.floor(Math.random() * dicebearStyles.length)];
        // Construct Dicebear API URL
        const profileImage = `https://api.dicebear.com/8.x/${randomStyle}/svg?seed=${userName}`;

        const user = new User({
            userName,
            email,
            password,
            profileImage,
            registeredAt: new Date(),
            lastLogin: new Date()
        });
        await user.save();

        const token = await generateToken(user._id);

        res.status(201).send({
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                profileImage: user.profileImage,
                registeredAt: user.registeredAt,
                lastLogin: user.lastLogin
            },
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        const token = await generateToken(user._id);
        res.status(200).send({
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                profileImage: user.profileImage,
                registeredAt: user.registeredAt,
                lastLogin: user.lastLogin
            },
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export { register, login, getAllUsers };