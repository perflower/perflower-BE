const express = require("express");
const { Fragrance } = require("../../models");
const csvFilePath = "./fragrance/fragrance.cvs";
const csv = require("csvtojson");

const fragrance = csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => {
            Fragrance.create({
                fragName: a.fragName,
                fragDescription: a.fragDescription,
            });
        });
    });

module.exports = { fragrance };
