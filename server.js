const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions');
const { cleanupExpiredRefreshTokens } = require("./lib/tokenCleanup");
const rateLimiter = require('./middlewares/rateLimiter');
const { generateVerificationCode } = require('./utils/helpers');
const logsHandler = require('./middlewares/logsHandler');
const errorHandler = require('./middlewares/errorHandler');

//importing routes
const logsRouter = require('./routes/logs')
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const cookiesRemoverRouter = require("./routes/cookiesRemover");
const refreshTokenRouter = require('./routes/refreshToken');
const verifyAccessToken = require('./middlewares/verifyAccessToken')
const userRouter = require('./routes/user');
const templateRouter = require('./routes/template');
const employeeRouter = require('./routes/employee');

dotenv.config();

const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI;

const app = express();
const maxRequests = 60; // Maximum requests allowed per client
const timeWindow = 60 * 1000; // Time window in milliseconds (e.g., 1 minute)


app.use(logsHandler)


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use(rateLimiter(maxRequests, timeWindow)); //use as per your need for all endpoint or for specific endpoint

cleanupExpiredRefreshTokens()


//setting endpoints
app.use([registerRouter, authRouter, cookiesRemoverRouter, refreshTokenRouter, logsRouter]);
app.use('/template', [templateRouter]);

app.use(verifyAccessToken);
app.use('/user', [userRouter]);
app.use("/employee", [employeeRouter])

app.use("*", (req, res) => {
    res.status(404).json({ success: false, message: "use vaild endpoint" })
})


app.use(errorHandler);

mongoose.connect(mongoURI).then(() => {
    console.log("database connection established");

    app.listen(PORT, () => {
        console.log(`server up and running ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
