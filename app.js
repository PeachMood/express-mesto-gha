const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');

const PORT = process.env.PORT || 3000;
const DB_URI = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(rateLimiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

mongoose.connect(DB_URI);

app.listen(PORT);
