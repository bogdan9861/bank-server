let express = require("express");
let router = express.Router();

let { get, add, remove, transaction, topUp } = require("../contollers/cards");
const { auth } = require("../middleware/auth");

router.get('/', auth, get)

router.post("/add", auth, add);

router.delete("/remove/:id", auth, remove);

router.put("/transaction", auth, transaction);

router.put("/topup", auth, topUp);

module.exports = router;
