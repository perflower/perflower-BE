const express = require("express");
const router = express.Router();

const user = require("./user");
const perfume = require("./perfume");
const review = require("./review");
const fragranceCategory = require("./fragranceCategory");
const community = require("./community");
const userTest = require("./userTest");
const search = require("./search");

router.use("/review", review);
router.use("/user", user);
router.use("/perfume", perfume);
router.use("/", fragranceCategory);
router.use("/userTest", userTest);
router.use("/community", community);
router.use("/search", search);

module.exports = router;
