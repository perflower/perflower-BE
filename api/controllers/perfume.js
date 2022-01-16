const express = require("express");
const {
  Perfume,
  Brand,
  Fragrance,
  Concentration,
  PerfumeLike,
} = require("../../models");
const { Op } = require("sequelize");

const findLikeList = () => {};

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
      });
    } //별점순 정렬
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
      });
    }

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).send({
      result: true,
      list: perfumes,
      lastPage,
    });
  } catch {
    res.status(400).send({
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
      filter = await Brand.findAll({
        attributes: ["brandId", "brandName"],
      });
    }
    if (filterNum == 1) {
      filter = await Fragrance.findAll({
        attributes: ["fragId", "fragName"],
      });
    }
    if (filterNum == 2) {
      filter = await Concentration.findAll({
        attributes: ["concentrationId", "concentrationName"],
      });
    }
    res.status(200).send({
      result: true,
      list: filter,
    });
  } catch {
    res.status(400).send({
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
      });
    } //별점순 정렬
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
      });
    }

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).send({
      result: true,
      list: perfumes,
      lastPage,
    });
  } catch {
    res.status(400).send({
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
      });
    } //별점순 정렬
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
      });
    }

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).send({
      result: true,
      list: perfumes,
      lastPage,
    });
  } catch {
    res.status(400).send({
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
      });
    } //별점순 정렬
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
      });
    }

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).send({
      result: true,
      list: perfumes,
      lastPage,
    });
  } catch {
    res.status(400).send({
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
      });
    } //별점순 정렬
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
      });
    }

    //향수 전체 개수
    allPerfumeCnt = perfumes.length;

    //무한스크롤 시 넘길 향수
    offsetCnt = scrollNum * 10;
    perfumes = perfumes.slice(offsetCnt, offsetCnt + 10);

    if (offsetCnt + 10 >= allPerfumeCnt) {
      lastPage = true;
    }

    //유저가 좋아요 누른 향수에는 true값 넣어주기
    perfumes.forEach((a) => {
      if (arr.includes(a.perfumeId)) {
        a.likeBoolean = true;
      }
    });

    res.status(200).send({
      result: true,
      list: perfumes,
      lastPage,
    });
  } catch {
    res.status(400).send({
      errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
    });
  }
};

//향수 상세정보 제공
const getPerfumeDetail = async (req, res) => {
  try {
    const { perfumeId } = req.params;

    const perfume = await Perfume.findAll({
      where: { perfumeId: perfumeId },
    });
    res.status(200).send({
      result: true,
      content: perfume,
    });
  } catch {
    res.status(400).send({
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
    res.status(400).send({
      errorMessage: "좋아요 오류 발생",
    });
  }
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
};
