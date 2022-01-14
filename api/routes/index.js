const express = require("express");
const router = express.Router();

const user = require("./user");
const perfume = require("./perfume");
const review = require("./review");
const fragranceCategory = require("./fragranceCategory");
// const auth = require("./auth");

router.use("/review", review);
// router.use('/auth', auth);
router.use("/user", user);
router.use("/", perfume, fragranceCategory);

module.exports = router;
