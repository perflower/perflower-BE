const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/auth-middleware");
const { community } = require("../controllers/community");

router.route("/").get(community);

module.exports = router;
