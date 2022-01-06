const { Brand } = require("../../models");
const byBrandFilePath = "./brand/brand.cvs";
const csv = require("csvtojson");

//빈 배열 생성
let perfumesByBrand = [];

//브랜드별 향수 배열 생성
const brand = csv()
    .fromFile(byBrandFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => {
            perfumesByBrand.push(a.brandName);
        });
        const set = new Set(perfumesByBrand);
        const uniqueArr = [...set];
        uniqueArr.forEach((a) =>
            Brand.create({
                brandName: a,
            })
        );
    });

module.exports = { brand };
