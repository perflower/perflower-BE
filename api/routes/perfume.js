const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const PerfumeController = require("../controllers/perfume");

//전체 향수 목록 출력
router.route("/all").get(authMiddleware, PerfumeController.getPerfumes);

//향수 필터링 필터 항목 출력
router.route("/filter").get(authMiddleware, PerfumeController.getFilters);

//브랜드별 필터링된 향수 출력
router
  .route("/filter/brand/:brandId")
  .get(authMiddleware, PerfumeController.getBrandPerfumes);

//향별 필터링된 향수 출력
router
  .route("/filter/frag/:fragId")
  .get(authMiddleware, PerfumeController.getFragPerfumes);

//농도별 필터링된 향수 출력
router
  .route("/filter/concent/:concentrationId")
  .get(authMiddleware, PerfumeController.getConcentPerfumes);

//가격범위로 필터링된 향수 출력
router
  .route("/filter/price")
  .get(authMiddleware, PerfumeController.getPricePerfumes);

//향수 상세정보 출력
router
  .route("/:perfumeId")
  .get(authMiddleware, PerfumeController.getPerfumeDetail);

//향수 좋아요&좋아요 취소
router
  .route("/like/:perfumeId")
  .patch(authMiddleware, PerfumeController.perfumeLike);

module.exports = router;
