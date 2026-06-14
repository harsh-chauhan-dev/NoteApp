import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: true,
            message: "Unauthorized"
        });
    }
    try {
        const decode = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );
        res.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Access token expired"
        });
    }
}