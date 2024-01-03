const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions');
const { cleanupExpiredRefreshTokens } = require("./lib/tokenCleanup")


// import express from 'express'
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

cleanupExpiredRefreshTokens()

//importing routes
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const verifyAccessToken = require('./middlewares/verifyAccessToken')
const userRouter = require('./routes/user');

const templateRouter = require('./routes/template');


//setting endpoints
app.use('/', [registerRouter]);
app.use('/', [authRouter]);
app.use('/', require('./routes/refreshToken'));

app.use(verifyAccessToken);
app.use('/user', [userRouter]);
app.use('/template', [templateRouter]);



// try {
//     await mongoose.connect(mongoURI);
//     console.log('db successfully connected');

//     app.listen(PORT, () => {
//         console.log('server up and running', PORT)
//     })

// } catch (error) {
//     console.error('database failed to connect', error)
// }

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("database connection established");

        app.listen(PORT, () => {
            console.log(`server up and running ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
