import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controller/user.controller.js";
import express from 'express';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refreshToken', refreshAccessToken);

export default router;