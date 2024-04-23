const express = require("express");
const router = express.Router();

const { get, register, login, setPhoto } = require("../contollers/users");
const { auth } = require("../middleware/auth");

router.get("/", auth, get);

router.put('/photo', auth, setPhoto)

router.post("/register", register);

router.post("/login", login);

module.exports = router;
