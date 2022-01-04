const express = require("express");
const { Perfume } = require("../models");
const csvFilePath = "./perfumeBasic.cvs";
const csv = require("csvtojson");

const perfumeBasic = csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => {
            Perfume.create({
                perfumeName: a.perfumeName,
                price: a.price,
                likeCnt: a.likeCnt,
                reviewCnt: a.reviewCnt,
            });
        });
    });

module.exports = { perfumeBasic };
