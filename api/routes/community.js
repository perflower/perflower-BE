const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/auth-middleware");
const {} = require("../controllers/review");

router.route("/hot").get(communityPerfume);
router.route("/hotReview").get(communityReview);

module.exports = router;
