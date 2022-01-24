const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/auth-middleware");
const SearchController = require("../controllers/search");

//향수 검색 - 글자 입력 할 때마다 들어오는 API
router.get("/list", authmiddleware, SearchController.listSearch);

//향수 검색 - 엔터 또는 목록 클릭 시(최종 검색 시) 들어오는 API
router.get("/list/detail", authmiddleware, SearchController.detailSearch);

//유저 검색 - 글자 입력 할 때마다 들어오는 API
router.get("/user/list", authmiddleware, SearchController.userSearch);

//유저 검색 - 엔터 또는 목록 클릭 시(최종 검색 시) 들어오는 API
router.get(
  "/user/list/detail",
  authmiddleware,
  SearchController.userDetailSearch
);

module.exports = router;
