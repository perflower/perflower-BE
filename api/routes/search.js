const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/auth-middleware");
const SearchController = require("../controllers/search");

//글자 입력 할 때마다 들어오는 API
router.get("/list", SearchController.listSearch);

//엔터 또는 목록 클릭 시(최종 검색 시) 들어오는 API
router.get("/list/detail", SearchController.detailSearch);

module.exports = router;
