const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/auth-middleware");
const {
  communityPerfume,
  communityReview,
} = require("../controllers/community");

router.route("/hot").get(communityPerfume);
router.route("/hotReview").get(communityReview);

module.exports = router;
