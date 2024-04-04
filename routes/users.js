const express = require("express");
const router = express.Router();

const { get, register, login } = require("../contollers/users");
const { auth } = require("../middleware/auth");

router.get("/", auth, get);

router.post("/register", register);

router.post("/login", login);

module.exports = router;
