const express = require("express");
const {
  Perfume,
  Brand,
  Fragrance,
  Concentration,
  PerfumeLike,
} = require("../../models");
const { Op } = require("sequelize");
const { afterDestroy } = require("../../models/user");
const { stringify } = require("qs");

//목록 페이지에서 좋아요 개수와 별점을 실시간으로 업데이트 된 사항을 보여줘야 함
//-> 불러올 때마다 DB에서 최신 data 꺼내가지고 보여줘야 함

//서버 실행 시 향수 목록 불러오기
let firstPerfumes = Perfume.findAll({
  attributes: ["price"],
}).then((result) => {
  firstPerfumes = result;
});

//전체 향수 목록 제공
const getPerfumes = async (req, res) => {
  const userId = res.locals.users.userId;
  const { orderType, scrollNum } = req.query;
  let perfumes,
    offsetCnt,
    lastPage = false;
  try {
    //향수에 좋아요 누른 게 있는지 찾기
    const checkList = await PerfumeLike.findAll({
      where: {
        userId: userId,
      },
    });
    //좋아요 누른 향수의 향수ID 찾기
    const arr = [];
    checkList.forEach((a) => arr.push(a.perfumeId));

    //모든 향수 조회
    //sol2. attributes 내부에 exclude 사용 => 제외할 항목만 선정 가능

    //좋아요순 정렬
    if (orderType == "like") {
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

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    //무한스크롤 마지막 페이지 여부
    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).json({
      result: true,
      list: perfumes,
      lastPage,
      perfumesCnt: allPerfumeCnt,
    });
  } catch {
    res.status(400).json({
      errorMessage: "전체 향수 데이터를 가져오는데 실패하였습니다.",
    });
  }
};

//향수 필터링 필터 목록 제공
const getFilters = async (req, res) => {
  try {
    const { filterNum } = req.query;
    let filter;
    console.log(filterNum);

    if (filterNum == 0) {
      filter = await Brand.findAll();
    }
    if (filterNum == 1) {
      filter = await Fragrance.findAll({
        attributes: ["fragId", "fragName"],
      });
    }
    if (filterNum == 2) {
      filter = await Concentration.findAll();
    }
    res.status(200).json({
      result: true,
      list: filter,
    });
  } catch {
    res.status(400).json({
      errorMessage: "향수 필터 데이터를 가져오는데 실패하였습니다.",
    });
  }
};

//브랜드 필터링된 향수 목록 제공
const getBrandPerfumes = async (req, res) => {
  const userId = res.locals.users.userId;
  const { brandId } = req.params;
  const { orderType, scrollNum } = req.query;
  let perfumes,
    offsetCnt,
    lastPage = false;
  try {
    //향수에 좋아요 누른 게 있는지 찾기
    const checkList = await PerfumeLike.findAll({
      where: {
        userId: userId,
      },
    });
    //좋아요 누른 향수의 향수ID 찾기
    const arr = [];
    checkList.forEach((a) => arr.push(a.perfumeId));

    //모든 향수 조회
    //좋아요순 정렬
    if (orderType == "like") {
      perfumes = await Perfume.findAll({
        where: { brandId: brandId },
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
        order: [["likeCnt", "DESC"]],
        include: [
          {
            model: Brand,
            attributes: ["brandName"],
          },
        ],
        raw: true,
      });
    }

    //별점순 정렬
    else if (orderType == "star") {
      perfumes = await Perfume.findAll({
        where: { brandId: brandId },
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

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    //무한스크롤 마지막 페이지 여부
    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).json({
      result: true,
      list: perfumes,
      lastPage,
      perfumesCnt: allPerfumeCnt,
    });
  } catch {
    res.status(400).json({
      errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
    });
  }
};

//향 필터링된 향수 목록 제공
const getFragPerfumes = async (req, res) => {
  const userId = res.locals.users.userId;
  const { fragId } = req.params;
  const { orderType, scrollNum } = req.query;
  let perfumes,
    offsetCnt,
    lastPage = false;
  try {
    //향수에 좋아요 누른 게 있는지 찾기
    const checkList = await PerfumeLike.findAll({
      where: {
        userId: userId,
      },
    });
    //좋아요 누른 향수의 향수ID 찾기
    const arr = [];
    checkList.forEach((a) => arr.push(a.perfumeId));

    //모든 향수 조회
    //좋아요순 정렬
    if (orderType == "like") {
      perfumes = await Perfume.findAll({
        where: { fragId: fragId },
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
        order: [["likeCnt", "DESC"]],
        include: [
          {
            model: Brand,
            attributes: ["brandName"],
          },
        ],
        raw: true,
      });
    }

    //별점순 정렬
    else if (orderType == "star") {
      perfumes = await Perfume.findAll({
        where: { fragId: fragId },
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

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    //무한스크롤 마지막 페이지 여부
    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).json({
      result: true,
      list: perfumes,
      lastPage,
      perfumesCnt: allPerfumeCnt,
    });
  } catch {
    res.status(400).json({
      errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
    });
  }
};

//농도 필터링된 향수 목록 제공
const getConcentPerfumes = async (req, res) => {
  const userId = res.locals.users.userId;
  const { concentrationId } = req.params;
  const { orderType, scrollNum } = req.query;
  let perfumes,
    offsetCnt,
    lastPage = false;

  try {
    //향수에 좋아요 누른 게 있는지 찾기
    const checkList = await PerfumeLike.findAll({
      where: {
        userId: userId,
      },
    });
    //좋아요 누른 향수의 향수ID 찾기
    const arr = [];
    checkList.forEach((a) => arr.push(a.perfumeId));

    //모든 향수 조회
    //좋아요순 정렬
    if (orderType == "like") {
      perfumes = await Perfume.findAll({
        where: { concentrationId: concentrationId },
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
        order: [["likeCnt", "DESC"]],
        include: [
          {
            model: Brand,
            attributes: ["brandName"],
          },
        ],
        raw: true,
      });
    }

    //별점순 정렬
    else if (orderType == "star") {
      perfumes = await Perfume.findAll({
        where: { concentrationId: concentrationId },
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

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    //무한스크롤 마지막 페이지 여부
    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).json({
      result: true,
      list: perfumes,
      lastPage,
      perfumesCnt: allPerfumeCnt,
    });
  } catch {
    res.status(400).json({
      errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
    });
  }
};

//가격 필터링된 향수 목록 제공
const getPricePerfumes = async (req, res) => {
  const userId = res.locals.users.userId;
  const { priceRange, orderType } = req.query;
  const price = priceRange.split("~");
  let perfumes;

  try {
    //향수에 좋아요 누른 게 있는지 찾기
    const checkList = await PerfumeLike.findAll({
      where: {
        userId: userId,
      },
    });
    //좋아요 누른 향수의 향수ID 찾기
    const arr = [];
    checkList.forEach((a) => arr.push(a.perfumeId));

    //모든 향수 조회
    //좋아요순 정렬
    if (orderType == "like") {
      perfumes = await Perfume.findAll({
        where: {
          [Op.and]: [
            { price: { [Op.gte]: price[0] } },
            { price: { [Op.lte]: price[1] } },
          ],
        },
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
        order: [["likeCnt", "DESC"]],
        include: [
          {
            model: Brand,
            attributes: ["brandName"],
          },
        ],
        raw: true,
      });
    }

    //별점순 정렬
    else if (orderType == "star") {
      perfumes = await Perfume.findAll({
        where: {
          [Op.and]: [
            { price: { [Op.gte]: price[0] } },
            { price: { [Op.lte]: price[1] } },
          ],
        },
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

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    //무한스크롤 마지막 페이지 여부
    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).json({
      result: true,
      list: perfumes,
      lastPage,
    });
  } catch {
    res.status(400).json({
      errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
    });
  }
};

//향수 상세정보 제공
const getPerfumeDetail = async (req, res) => {
  const { perfumeId } = req.params;
  const userId = res.locals.users.userId;
  try {
    //향수에 좋아요 누른 게 있는지 찾기
    const checkList = await PerfumeLike.findAll({
      where: {
        userId: userId,
      },
    });

    //좋아요 누른 향수의 향수ID 찾기
    const arr = [];
    checkList.forEach((a) => arr.push(a.perfumeId));

    //향수 상세정보 불러오기
    const perfume = await Perfume.findOne({
      where: { perfumeId: perfumeId },
      include: {
        model: Brand,
        attributes: ["brandName"],
      },
      raw: true,
    });

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    if (arr.includes(perfume.perfumeId)) {
      perfume.likeBoolean = true;
    }

    res.status(200).json({
      result: true,
      content: perfume,
    });
  } catch {
    res.status(400).json({
      errorMessage: "향수 상세데이터를 가져오는데 실패하였습니다.",
    });
  }
};

//향수 좋아요 & 좋아요 취소
const perfumeLike = async (req, res) => {
  const { perfumeId } = req.params;
  const userId = res.locals.users.userId;

  try {
    //대상 향수 찾기
    const perfume = await Perfume.findOne({
      where: { perfumeId: perfumeId },
    });
    //대상 향수에 좋아요 누른 게 있는지 찾기
    const checkList = await PerfumeLike.findAll({
      where: { [Op.and]: [{ userId: userId }, { perfumeId: perfumeId }] },
    });
    //대상 향수가 있을 경우
    if (perfume) {
      //만약 좋아요 누른 게 없으면 좋아요
      if (checkList.length < 1) {
        await PerfumeLike.create({
          userId: userId,
          perfumeId: perfumeId,
        });
        //향수 DB의 좋아요 개수 최신화
        const perfumes = await PerfumeLike.findAll({
          where: {
            perfumeId: perfumeId,
          },
        });
        await Perfume.update(
          {
            likeCnt: perfumes.length,
          },
          {
            where: {
              perfumeId: perfumeId,
            },
          }
        );

        return res.status(200).json({
          result: true,
          message: "좋아요",
        });
      } //좋아요 누른 게 있으면 좋아요 취소
      else {
        await PerfumeLike.destroy({
          where: {
            [Op.and]: [
              {
                perfumeId: perfumeId,
              },
              { userId: userId },
            ],
          },
        });

        //향수 DB의 좋아요 개수 최신화
        const perfumes = await PerfumeLike.findAll({
          where: {
            perfumeId: perfumeId,
          },
        });
        await Perfume.update(
          {
            likeCnt: perfumes.length,
          },
          {
            where: {
              perfumeId: perfumeId,
            },
          }
        );

        return res.status(200).json({
          result: true,
          message: "좋아요 취소",
        });
      }
    }
  } catch {
    res.status(400).json({
      errorMessage: "좋아요 오류 발생",
    });
  }
};

//가격 범위(1000원 단위) 당 향수 개수 제공
const getPricePerfumeCnt = async (req, res) => {
  let cntArr = [];
  let beforePrice = 0,
    afterPrice = 1000;

  for (let i = 0; i < 130; i++) {
    const attributesName = `${beforePrice}~${afterPrice}`;

    cntArr[i] = new Object();
    cntArr[i] = { [attributesName]: 0 };

    firstPerfumes.forEach((a) => {
      if (beforePrice <= a.price && a.price < afterPrice) {
        cntArr[i][attributesName]++;
      }
    });

    beforePrice = beforePrice + 1000;
    afterPrice = afterPrice + 1000;
  }

  res.status(200).json({ result: true, list: cntArr });
};

module.exports = {
  getPerfumes,
  getFilters,
  getBrandPerfumes,
  getFragPerfumes,
  getConcentPerfumes,
  getPricePerfumes,
  getPerfumeDetail,
  perfumeLike,
  getPricePerfumeCnt,
};
