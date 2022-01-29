const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const getLikeList = require("../middlewares/getLikeList");
const PerfumeController = require("../controllers/perfume");

//전체 향수 목록 출력
router.get("/all", authMiddleware, getLikeList, PerfumeController.getPerfumes);

//향수 필터링 필터 항목 출력
router.get("/filter", authMiddleware, PerfumeController.getFilters);

//브랜드별 필터링된 향수 출력
router.get(
  "/filter/brand/:brandId",
  authMiddleware,
  getLikeList,
  PerfumeController.getBrandPerfumes
);

//향별 필터링된 향수 출력
router.get(
  "/filter/frag/:fragId",
  authMiddleware,
  getLikeList,
  PerfumeController.getFragPerfumes
);

//농도별 필터링된 향수 출력
router.get(
  "/filter/concent/:concentrationId",
  authMiddleware,
  getLikeList,
  PerfumeController.getConcentPerfumes
);

//가격범위로 필터링된 향수 출력
router.get(
  "/filter/price",
  authMiddleware,
  getLikeList,
  PerfumeController.getPricePerfumes
);

//향수 상세정보 출력
router.get(
  "/:perfumeId",
  authMiddleware,
  getLikeList,
  PerfumeController.getPerfumeDetail
);

//향수 좋아요&좋아요 취소
router.patch("/like/:perfumeId", authMiddleware, PerfumeController.perfumeLike);

////가격 범위(1000원 단위) 당 향수 개수 제공
router.get(
  "/price/perfumeCnt",
  authMiddleware,
  PerfumeController.getPricePerfumeCnt
);

module.exports = router;
