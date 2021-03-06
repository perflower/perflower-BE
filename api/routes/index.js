const express = require("express");
const router = express.Router();

const user = require("./user");
const perfume = require("./perfume");
const review = require("./review");
const community = require("./community");
const userTest = require("./userTest");
const search = require("./search");
const apiLimiter = require("../middlewares/limiter");

router.use(apiLimiter);
router.use("/review", review);
router.use("/user", user);
router.use("/perfume", perfume);
router.use("/userTest", userTest);
router.use("/community", community);
router.use("/search", search);

module.exports = router;
