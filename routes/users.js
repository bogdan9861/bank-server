let express = require("express");
let router = express.Router();

let { register, login } = require("../contollers/users");
const { auth } = require("../middleware/auth");

// get all
router.post("/register", register);

router.post("/login", auth, login);

module.exports = router;
