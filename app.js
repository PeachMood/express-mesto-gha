const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// const globalUserSetter = require('./middlewares/globalUserSetter');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');

const PORT = process.env.PORT || 3000;
const DB_URI = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Хотелось бы не загрязнять точку входа лишним кодом
// и вынести все мидлвэры в отдельную папку, однако тесты не позволяют
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});

// app.use(globalUserSetter);
app.use(router);
app.use(errorHandler);

mongoose.connect(DB_URI);

app.listen(PORT);
