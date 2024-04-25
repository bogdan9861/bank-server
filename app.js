const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors({ origin: "https://main--wonderful-cat-6c2c99.netlify.app/" }));
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/cards", require("./routes/cards"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/history", require("./routes/history"));

module.exports = app;
