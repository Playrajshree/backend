const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./src/routes/auth.route');
const resultRouter = require("./src/routes/gameResult.route");
const rateLimit = require("express-rate-limit");
// initialize express


const app = express();
app.use(cors({
  origin: ["https://rajshreeplays.com", "http://localhost:5173"],
  credentials: true
}));

app.use(rateLimit({
   windowMs: 15 * 60 * 1000,
   limit: 1000,
   message: "Too many requests, please try again later.",
   standardHeaders: true,
   legacyHeaders: false
}))

app.use(
  express.json({
    limit: '1MB',
  })
);
app.use(
  express.urlencoded({
    limit: '1MB',
    extended: true,
  })
);
app.use(cookieParser());

// here the route setup will work
app.use('/api/v1/auth', authRouter);
app.use("/api/v1/game-results", resultRouter);



// global error handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server error';

  res.status(status).json({
    
      statusCode: status,
      status: false,
      message: message,
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
});

module.exports = app;
