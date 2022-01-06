const express = require("express");
const { Brand } = require("../../models");
const csvFilePath = "./brand/brand.cvs";
const csv = require("csvtojson");

const brand = csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => {
            Brand.create({
                brandName: a.brandName,
            });
        });
    });

module.exports = { brand };
