const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth-middleware");
const { community } = require("../controllers/community");

router.route("/").get(authorization, community);

module.exports = router;
