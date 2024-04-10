const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { getAll, create, remove } = require("../contollers/contacts");

router.get("/", auth, getAll);

router.post("/add", auth, create);

router.delete("/remove/:id", auth, remove);

module.exports = router;
