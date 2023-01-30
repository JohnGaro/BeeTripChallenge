const express = require("express");

const router = express.Router();

const itemControllers = require("./controllers/itemControllers");

router.get("/items", itemControllers.browse);
// router.post("/resultgame", itemControllers.add);

module.exports = router;
