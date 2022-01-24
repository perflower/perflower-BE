const express = require("express");
const { Perfume, Brand, PerfumeLike } = require("../../models");
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
let perfumes = Perfume.findAll().then((result) => {
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
      //match 메소드로 결과값 반환 받은 경우(해당 문자열이 포함되는 제목이 있는 경우) && 최대 3개만 제공
      if ((check !== null || checkEng !== null) && brandSearched.length < 3) {
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

    res.status(200).json({
      result: true,
      brands: brandSearched,
      perfumes: perfumeSearched,
      perfumesCnt: perfumeSearched.length,
    });
  } catch (err) {
    res.status(400).json({
      errorMessage: "검색 중 오류 발생",
    });
    console.error(err);
  }
};

//사용자가 엔터 치거나 목록 클릭 시(최종 검색 시) 들어오는 API
//최신화된 data(좋아요 개수, 별점 등)를 보여주기 위해 새로 DB에서 data를 꺼내옴.(브랜드 제외, 향수만)
const detailSearch = async (req, res) => {
  const userId = res.locals.users.userId;
  const { word, orderType, scrollNum } = req.query;
  let perfumeSearched = [],
    brandSearched = []; //검색 결과를 위한 빈 배열
  let lastPage = false; //무한페이지 마지막 페이지 여부
  const wordExp = getRegExp(word); //한글 검색 라이브러리 사용. 예를 들어 ㄷ을 입력하면 ㄷ 이후에 올 수 있는 문자 종류를 정규식으로 반환해줌
  const commonAttribute = [
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
  ]; //향수 속성 중 가져올 속성 목록 지정

  //최신 향수 목록 불러오기

  //인기순 정렬
  if (orderType == "like") {
    perfumes = await Perfume.findAll({
      attributes: commonAttribute,
      order: [["likeCnt", "DESC"]],
      include: [
        {
          model: Brand,
          attributes: ["brandName"],
        },
      ],
      raw: true, //객체의 중첩을 푸는 옵션. 그러나, 객체 키가 사용하기 불편해진다. ex) perfume.['Brand.brandName']
    });
  }

  //별점순 정렬
  else if (orderType == "star") {
    perfumes = await Perfume.findAll({
      attributes: commonAttribute,
      order: [["starRatingAvg", "DESC"]],
      include: [
        {
          model: Brand,
          attributes: ["brandName"],
        },
      ],
      raw: true,
    });
  }

  //향수에 좋아요 누른 게 있는지 찾기
  const checkList = await PerfumeLike.findAll({
    where: {
      userId: userId,
    },
  });

  //좋아요 누른 향수의 향수ID 찾기
  const arr = [];
  checkList.forEach((a) => arr.push(a.perfumeId));

  //유저가 좋아요 누른 향수에는 true값 넣어주기
  perfumes.forEach((a) => {
    if (arr.includes(a.perfumeId)) {
      a.likeBoolean = true;
    }
  });

  try {
    //첫 페이지에서만 브랜드 목록 제공
    if (scrollNum == 0) {
      brands.forEach((a) => {
        const check = a.brandName.match(wordExp);
        const checkEng = a.engBrandName.match(wordExp);
        if ((check !== null || checkEng !== null) && brandSearched.length < 3) {
          brandSearched.push(a);
        }
      });
    }

    //검색어와 일치하는 향수 뽑아내기
    perfumes.forEach((a) => {
      const check = a.perfumeName.match(wordExp);
      if (check !== null) {
        perfumeSearched.push(a);
      }
    });

    //향수 전체 개수
    allPerfumeCnt = perfumeSearched.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumeSearched = perfumeSearched.slice(offsetCnt, offsetCnt + 10);

    //무한스크롤 마지막 페이지 여부
    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    res.status(200).json({
      result: true,
      brands: brandSearched,
      perfumes: perfumeSearched,
      lastPage,
      perfumesCnt: allPerfumeCnt,
    });
  } catch (err) {
    res.status(400).json({
      errorMessage: "검색 중 오류 발생",
    });
    console.error(err);
  }
};

module.exports = { listSearch, detailSearch };
