import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './router/userRoutr.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());

app.use('/api', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

