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

router.route("/1/:userSelect").get(authorization, userTest1);
router.route("/2/:userSelect").get(authorization, userTest2);
router.route("/3/:userSelect").get(authorization, userTest3);
router.route("/4/:userSelect").get(authorization, userTest4);
router.route("/5/:userSelect").get(authorization, userTest5);
router.route("/6/:userSelect").get(authorization, userTest6);
router.route("/7/:userSelect").get(authorization, userTest7);
router.route("/8/:userSelect").get(authorization, userTest8);
router.route("/9/:userSelect").get(authorization, userTestResult);

module.exports = router;
