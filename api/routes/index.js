const express = require("express");
const router = express.Router();

const user = require("./user");
const perfume = require("./perfume");
const review = require("./review");
const fragranceCategory = require("./fragranceCategory");


router.use("/review", review);
router.use("/user", user);
router.use("/", perfume, fragranceCategory);

module.exports = router;
