require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');

const { PORT = 3000, DB_URI = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(rateLimiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_URI);

app.listen(PORT);
