require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/loggers/requestLogger');
const errorLogger = require('./middlewares/loggers/errorLogger');
const router = require('./routes');

const { PORT = 3000, DB_URI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(rateLimiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_URI);

app.listen(PORT);
