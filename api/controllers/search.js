const express = require("express");
const { Perfume, Brand } = require("../../models");
const { Op } = require("sequelize");
const { getRegExp } = require("korean-regexp");

//검색 로직
//1. 서버 실행 시 향수 목록을 불러온다.
//2. 유저가 입력 할 때마다 API에 요청함.
//2-1. 상수(입력 받은 값), 빈 배열(검색 결과) 생성
//3. 향수 목록 배열을 순회한다.
//4. (순회 중) 입력받은 글자와 향수 이름을 비교하여 같으면 결과 배열에 push.
//4-1. Q. 어떻게 비교?
//4-2. 조건 : 제목에 입력받은 값이 포함되어 있으면 결과 배열에 push한다.

//서버 실행 시 향수 목록 불러오기
let perfumes = Perfume.findAll({
  attributes: ["perfumeName"],
}).then((result) => {
  perfumes = result;
});
//서버 실행 시 브랜드 목록 불러오기
let brands = Brand.findAll().then((result) => {
  brands = result;
});

//사용자가 문자 입력할 때마다 들어오는 API
//검색창에 입력할 때마다 즉각적으로 결과를 보여주기 위해서는 속도가 빨라야 함.
//-> DB에 접속하지 않는 방법으로 속도 향상.
//-> 이름과 목록만을 보여주기 위한 DB는 위에서 미리 생성해 놓음.(서버 실행 시)
//-> 해당 data를 가지고 검색해서 목록을 보여줌.
//-> 실제로 엔터 또는 목록 클릭해서 검색 시 DB에서 꺼내서 최신화된 data를 보내준다.
//-> 죽, 이 API는 서버 킬 때 기준의 data로 검색 결과 목록을 빠르게 보여주기 위한 API다.
const listSearch = async (req, res) => {
  const { word } = req.query;
  const perfumeSearched = [],
    brandSearched = []; //검색 결과를 위한 빈 배열
  const wordExp = getRegExp(word); //한글 검색 라이브러리 사용. 예를 들어 ㄷ을 입력하면 ㄷ 이후에 올 수 있는 문자 종류를 정규식으로 반환해줌

  try {
    //검색어와 일치하는 브랜드 뽑아내기
    //서비스 동작 : 브랜드 이름 검색 -> 검색한 브랜드 목록 제공 -> 검색 목록 클릭 시 해당 항목을 검색한 결과창으로 이동
    brands.forEach((a) => {
      const check = a.brandName.match(wordExp); //브랜드 한글 이름에 정규식에 포함되는 문자가 있으면 결과값 반환
      const checkEng = a.engBrandName.match(wordExp); //브랜드 영어 이름에 정규식에 포함되는 문자가 있으면 결과값 반환, 정규식 마지막에 i가 붙기 때문에 대소문자 구분 X
      //match 메소드로 결과값 반환 받은 경우(해당 문자열이 포함되는 제목이 있는 경우)
      if (check !== null || checkEng !== null) {
        brandSearched.push(a);
      }
    });

    //검색어와 일치하는 향수 뽑아내기
    perfumes.forEach((a) => {
      const check = a.perfumeName.match(wordExp); //향수 이름에 정규식에 포함되는 문자가 있으면 결과값 반환
      if (check !== null) {
        perfumeSearched.push(a);
      }
    });

    res
      .status(200)
      .json({ result: true, perfumes: perfumeSearched, brands: brandSearched });
  } catch {
    res.status(400).json({
      errorMessage: "검색 중 오류 발생",
    });
  }
};

//사용자가 엔터 치거나 목록 클릭 시(최종 검색 시) 들어오는 API
//최신화된 data(좋아요 개수, 별점 등)를 보여주기 위해 새로 DB에서 data를 꺼내옴.(브랜드 제외, 향수만)
const detailSearch = async (req, res) => {
  const { word } = req.query;
  const perfumeSearched = [],
    brandSearched = []; //검색 결과를 위한 빈 배열
  const wordExp = getRegExp(word); //한글 검색 라이브러리 사용. 예를 들어 ㄷ을 입력하면 ㄷ 이후에 올 수 있는 문자 종류를 정규식으로 반환해줌

  //최신 향수 목록 불러오기
  perfumes = await Perfume.findAll({
    attributes: [
      "perfumeId",
      "fragId",
      "brandId",
      "concentrationId",
      "perfumeName",
      "price",
      "likeBoolean",
      "likeCnt",
      "reviewCnt",
      "imgUrl",
      "starRatingAvg",
    ],
  });

  try {
    //검색어와 일치하는 브랜드 뽑아내기
    //서비스 동작 : 브랜드 이름 검색 -> 검색한 브랜드 목록 제공 -> 검색 목록 클릭 시 해당 항목을 검색한 결과창으로 이동
    brands.forEach((a) => {
      const check = a.brandName.match(wordExp); //브랜드 한글 이름에 정규식에 포함되는 문자가 있으면 결과값 반환
      const checkEng = a.engBrandName.match(wordExp); //브랜드 영어 이름에 정규식에 포함되는 문자가 있으면 결과값 반환, 정규식 마지막에 i가 붙기 때문에 대소문자 구분 X
      //match 메소드로 결과값 반환 받은 경우(해당 문자열이 포함되는 제목이 있는 경우)
      if (check !== null || checkEng !== null) {
        brandSearched.push(a);
      }
    });

    //검색어와 일치하는 향수 뽑아내기
    perfumes.forEach((a) => {
      const check = a.perfumeName.match(wordExp); //향수 이름에 정규식에 포함되는 문자가 있으면 결과값 반환
      if (check !== null) {
        perfumeSearched.push(a);
      }
    });

    res
      .status(200)
      .json({ result: true, perfumes: perfumeSearched, brands: brandSearched });
  } catch {
    res.status(400).json({
      errorMessage: "검색 중 오류 발생",
    });
  }
};

module.exports = { listSearch, detailSearch };
