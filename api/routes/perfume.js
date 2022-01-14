const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const {
  getPerfumes,
  getFilters,
  getBrandPerfumes,
  getFragPerfumes,
  getConcentPerfumes,
  getPricePerfumes,
  getPerfumeDetail,
  perfumeLike,
} = require("../controllers/perfume");

//전체 향수 목록 출력
router.route("/all").get(authMiddleware, getPerfumes);

//향수 필터링 필터 항목 출력
router.route("/filter").get(getFilters);

//브랜드별 필터링된 향수 출력
router.route("/filter/brand/:brandId").get(getBrandPerfumes);

//향별 필터링된 향수 출력
router.route("/filter/frag/:fragId").get(getFragPerfumes);

//농도별 필터링된 향수 출력
router.route("/filter/concent/:concentrationId").get(getConcentPerfumes);

//가격별 필터링된 향수 출력
router.route("/filter/price").get(getPricePerfumes);

//향수 상세정보 출력
router.route("/:perfumeId").get(getPerfumeDetail);

//향수 좋아요&좋아요 취소
router.route("/like/:perfumeId").patch(authMiddleware, perfumeLike);

module.exports = router;
