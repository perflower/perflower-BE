const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth-middleware");
const {
  userTest1,
  userTest2,
  userTest3,
  userTest4,
  userTest5,
  userTest6,
  userTest7,
  userTest8,
  userTestResult,
} = require("../controllers/userTest");

//유저취향테스트 선택문항 받아서 update
router.route("/1").get(authorization, userTest1);
router.route("/2").get(userTest2);
router.route("/3").get(userTest3);
router.route("/4").get(userTest4);
router.route("/5").get(userTest5);
router.route("/6").get(userTest6);
router.route("/7").get(userTest7);
router.route("/8").get(userTest8);
router.route("/9").get(userTestResult);
module.exports = router;
