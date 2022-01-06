const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/auth-middleware");
const {
    reviewPost,
    reviewGetThree,
    reviewGetAll,
    reviewUpdate,
    reviewDelete,
    reviewLike,
    reviewLikeDelete,
    test,
} = require("../controllers/review");

//리뷰등록
router.route("/:perfumeId").post(reviewPost);

//향수페이지 리뷰 3개 조회
router.route("/:perfumeId/three").get(reviewGetThree);

//상세리뷰페이지 리뷰 전체조회
router.route("/:perfumeId/all").get(reviewGetAll);

router.route("/:reviewId").put(reviewUpdate).delete(reviewDelete);
router.route("/:reviewId/like").post(reviewLike).delete(reviewLikeDelete);

router.route("/test").get(test);
module.exports = router;
