const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/auth-middleware");
const SearchController = require("../controllers/search");

router.route("/").get();

module.exports = router;
