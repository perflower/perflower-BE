const express = require("express");
const { Perfume } = require("../../models");
const csvFilePath = "./perfumeBasic/perfumeBasic.cvs";
const csv = require("csvtojson");

const perfumeBasic = csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    // 중복되는 향수 제거
    let dupArr = [0];
    jsonObj.forEach((a) => {
      let check = false;
      dupArr.forEach((b) => {
        if (a.perfumeName === b.perfumeName) {
          check = true;
        }
      });
      if (!check) dupArr.push(a);
    });
    dupArr.shift();

    //DB에 향수 등록
    dupArr.forEach(async (a) => {
      await Perfume.create({
        perfumeName: a.perfumeName,
        price: a.price,
        likeCnt: a.likeCnt,
        reviewCnt: a.reviewCnt,
        imgUrl: a.imgUrl,
        originImgUrl: a.originImgUrl,
      });
    });
  });

module.exports = { perfumeBasic };
