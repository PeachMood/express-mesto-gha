const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const appConfig = require('./configs/appConfig');
const dbConfig = require('./configs/dbConfig');
const rateLimiter = require('./middlewares/rateLimiter');
const corsResolver = require('./middlewares/corsResolver');
const requestLogger = require('./middlewares/loggers/requestLogger');
const errorLogger = require('./middlewares/loggers/errorLogger');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');

const app = express();

app.use(rateLimiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(corsResolver);
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(dbConfig.uri);

app.listen(appConfig.port);
