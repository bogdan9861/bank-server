const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { get } = require("../contollers/history");

router.get("/", auth, get);

module.exports = router;
