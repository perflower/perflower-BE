const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth-middleware");
const upload = require("../middlewares/upload");
const passport = require("passport");

const {
  userLogin,
  userRegister,
  userFollow,
  getUser,
  reviewPerfume,
  likePerfume,
  updateUser,
  deleteUser,
  profileUpload,
  getFollowingList,
  getFollowerList,
  kakaoCallback,
  kakaoLogout,
} = require("../controllers/user");

// 로그인
router.post("/login", userLogin);

// 회원가입
router.post("/register", userRegister);

// 카카오 로그인
router.get("/kakao", passport.authenticate("kakao"));

// 카카오 콜백
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/" }),
  kakaoCallback
);

// 카카오 로그아웃
router.get("/kakao/logout", kakaoLogout);

// 유저 프로필 조회
router.get("/:userId", authorization, getUser);

// 유저 프로필 변경
router.put("/:userId", authorization, updateUser);

// 유저 삭제
router.delete("/:userId", authorization, deleteUser);

// 팔로잉 리스트
router.get("/following/:userId", authorization, getFollowingList);

// 팔로워 리스트
router.get("/follower/:userId", authorization, getFollowerList);

// 팔로워 팔로잉하기/취소하기
router.post("/follow/:userId", authorization, userFollow);

// 내가 리뷰 작성한 향수 리스트
router.get("/review/:userId", authorization, reviewPerfume);

// 내가 찜한(좋아요) 향수 리스트
router.get("/like/:userId", authorization, likePerfume);

// 프로필 업로드
router.post("/:userId", upload.single("img"), profileUpload);

module.exports = router;
