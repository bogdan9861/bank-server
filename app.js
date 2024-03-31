const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const app = express();

app.use(logger('dev'));

app.use(express.json());-
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/cards", require("./routes/cards"));
app.use("/api/contacts", require("./routes/contacts"));

module.exports = app;
