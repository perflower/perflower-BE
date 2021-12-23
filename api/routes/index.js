const express = require("express");
const router = express.Router();

const user = require("./user");
const perfume = require("./perfume");
const review = require("./review");
const fragranceCategory = require("./fragranceCategory");

router.use("/", user);
router.use("/", perfume, review, fragranceCategory);

module.exports = router;
