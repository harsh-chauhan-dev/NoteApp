import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const auth = (req, res, next) => {
    const token = req.cookies?.token;
    // console.log("Cookies: ",req.cookies);

    if (!token) {
        return res.status(401).json({
            success: true,
            message: "Unauthorized"
        });
    }
    // console.log("Token: ",token);
    try {
        const decode = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Access token expired"
        });
    }
}