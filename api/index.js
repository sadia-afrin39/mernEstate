import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.listen(5000, ()=> {
    console.log('Server is running on port 5000');
});

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("conneted to MongoDB");
}).catch((err)=>{
  console.log(err);
});

const __dirname = path.resolve();

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/build')));  //run the client side on server

app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname, 'client','build','public','index.html'));
})

//Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
 });


