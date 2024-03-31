const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { create, getAll } = require("../contollers/contacts");

router.get("/", auth, getAll);
router.post("/add", auth, create);

module.exports = router;
