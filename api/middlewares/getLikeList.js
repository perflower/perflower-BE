const express = require("express");
const { PerfumeLike } = require("../../models");

module.exports = async (req, res, next) => {
  const userId = res.locals.users.userId;

  try {
    //향수에 좋아요 누른 게 있는지 찾기
    const checkList = await PerfumeLike.findAll({
      where: {
        userId: userId,
      },
    });

    //좋아요 누른 향수의 향수ID 찾기
    const likeList = [];
    checkList.forEach((a) => likeList.push(a.perfumeId));

    res.locals.likeList = likeList;

    next();
  } catch (err) {
    res.status(400).json({
      result: false,
      errorMessage: "좋아요 누른 향수 ID 목록 가져오기 실패",
    });
    console.error(err);
  }
  return;
};
