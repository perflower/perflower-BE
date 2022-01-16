const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth-middleware");
const {
  reviewPost,
  reviewGet,
  reviewGetThreeByLatest,
  reviewGetThreeByPopular,
  reviewGetAllByLatest,
  reviewGetAllByPopular,
  reviewUpdate,
  reviewDelete,
  reviewLike,
  reviewLikeDelete,
  test,
} = require("../controllers/review");

//리뷰등록
router.route("/:perfumeId").post(authorization, reviewPost);
//리뷰 상세조회
router.route("/:reviewId").get(reviewGet);
//리뷰 수정 및 삭제
router
  .route("/:reviewId")
  .put(authorization, reviewUpdate)
  .delete(authorization, reviewDelete);
//향수페이지 리뷰 3개 조회 (최신순)
router.route("/:perfumeId/three/byLatest").get(reviewGetThreeByLatest);
//향수페이지 리뷰 3개 조회 (인기순)
router.route("/:perfumeId/three/byPopular").get(reviewGetThreeByPopular);
//리뷰페이지 리뷰 전체조회(최신순)
router.route("/:perfumeId/all/byLatest").get(reviewGetAllByLatest);
//리뷰페이지 리뷰 전체조회(최신순)
router.route("/:perfumeId/all/byPopular").get(reviewGetAllByPopular);
//리뷰 좋아요 및 취소
router
  .route("/:perfumeId/:reviewId/like")
  .post(authorization, reviewLike)
  .delete(authorization, reviewLikeDelete);
//유저의 리뷰라이크정보전달

//테스트
router.route("/test").get(test);

module.exports = router;
