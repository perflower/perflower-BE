const express = require("express");
const { Perfume } = require("../../models");
const { Brand } = require("../../models");
const byBrandFilePath = "./perfumesByBrand.cvs";
const byConcentFilePath = "./perfumesByConcent.cvs";
const byFragFilePath = "./perfumesByFrag.cvs";
const csv = require("csvtojson");

let perfumesByBrand = [],
    perfumesByConcent = [],
    perfumesByFrag = [];

const getPerfumesByBrand = csv()
    .fromFile(byBrandFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => perfumesByBrand.push(a));
    });

const getPerfumesByConcent = csv()
    .fromFile(byConcentFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => perfumesByConcent.push(a));
    });

const getPerfumesByFrag = csv()
    .fromFile(byFragFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => perfumesByFrag.push(a));
    });

async function getPerfumes() {
    await getPerfumesByBrand;
    await getPerfumesByConcent;
    await getPerfumesByFrag;
}

getPerfumes().then(async () => {
    brandArr = [];
    num = 0;
    perfumesByBrand.forEach(async (a) => {
        let i = "";
        let brand = "";
        brand = await Brand.findOne({
            where: {
                brandName: a.brandName,
            },
        });
        num = num + 1;
        const brandId = brand.dataValues.brandId;
        console.log("x번째 향수 : ", num);
        console.log("brandId : ", brandId);
        a.brandId = brandId;
        brandArr.push(a);
        if (num == perfumesByBrand.length) {
            console.log(brandArr);
        }
    });
    console.log(brandArr);
});

// module.exports = { getPerfumes };
