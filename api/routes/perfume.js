const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/auth-middleware");
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
router.route("/all").get(getPerfumes);

//
router.route("/filter").get(getFilters);

//
router.route("/filter/brand/:brandId").get(getBrandPerfumes);

//
router.route("/filter/frag/:fragId").get(getFragPerfumes);

//
router.route("/filter/concent/:concentrationId").get(getConcentPerfumes);

//
router.route("/filter/price").get(getPricePerfumes);

//
router.route("/:perfumeId").get(getPerfumeDetail);

//향수 좋아요&좋아요 취소
router.route("/like/:perfumeId").patch(authmiddleware, perfumeLike);

module.exports = router;
