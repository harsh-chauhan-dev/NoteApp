import pool from '../config/db_config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
    generateAccessToken,
    generateRefreshToken
} from '../utils/generateTokens.js';

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
};

// Register User
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, username, email`,
            [username, email, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const payload = {
            id: user.id,
            email: user.email
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('token', accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: _, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: safeUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token missing'
        });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const accessToken = jwt.sign(
            {
                id: decoded.id,
                email: decoded.email
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: '15m'
            }
        );

        res.cookie('token', accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Access token refreshed'
        });

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};

// Logout User
export const logoutUser = async (req, res) => {

    res.clearCookie('token', cookieOptions);

    res.clearCookie('refreshToken', cookieOptions);

    return res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

