const express = require("express");
const router = express.Router();
const passport = require("passport");
const authorization = require("../middlewares/auth-middleware");
const {
    userLogin,
    userRegister,
    kakaoLogin,
    userFollow,
    getUser,
    reviewPerfume,
    likePerfume,
    updateUser,
} = require("../controllers/user");

// const passportLogin = require("../controllers/")
// // const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')

// // const isuser = require("../middlewares/doMiddlewares");
// // const upload = require("../utils/s3");

// 로그인
router.post("/login", userLogin);

// 회원가입
router.post("/register", userRegister);

// 카카오 로그인
// router.get("/kakao", kakaoLogin);

// 유저 프로필 페이지
router.get("/:userId", authorization, getUser);

// // 팔로우 기능
router.post("/follow/:userId", authorization, userFollow);

// 내가 리뷰 작성한 향수 리스트
router.get("/review/:userId", reviewPerfume);

// 내가 찜한(좋아요) 향수 리스트
router.get("/like/:userId", likePerfume);

// // 유저 프로필 변경 페이지
// router.put("/:userId", updateUser);

//
module.exports = router;
