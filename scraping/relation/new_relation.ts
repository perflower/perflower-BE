import csv from "csvtojson";
import { Sequelize } from "sequelize/dist";
const byBrandFilePath = "./perfumesByBrand.cvs";
const byConcentFilePath = "./perfumesByConcent.cvs";
const byFragFilePath = "./perfumesByFrag.cvs";

const { Perfume, Brand, Concentration, Fragrance } = require("../../models");
//빈 배열 생성
const perfumesByBrand: {
  perfumeName: string;
  price: string;
  likeCnt: string;
  reviewCnt: string;
  brandName: string;
}[] = [];
const perfumesByConcent: {
  perfumeName: string;
  concentrationName: string;
}[] = [];
const perfumesByFrag: {
  perfumeName: string;
  fragranceName: string;
}[] = [];

//브랜드별 향수 배열 생성
const getPerfumesByBrand = csv()
  .fromFile(byBrandFilePath)
  .then((jsonObj) => {
    jsonObj.forEach((a) => perfumesByBrand.push(a));
  });

//농도별 향수 배열 생성
const getPerfumesByConcent = csv()
  .fromFile(byConcentFilePath)
  .then((jsonObj) => {
    jsonObj.forEach((a) => perfumesByConcent.push(a));
  });

//향별 향수 배열 생성
const getPerfumesByFrag = csv()
  .fromFile(byFragFilePath)
  .then((jsonObj) => {
    jsonObj.forEach((a) => perfumesByFrag.push(a));
  });

async function getPerfumes() {}

type PerfumeMap = {
  [key: perfumeName]: number;
};

type perfumeName = string;
const brandMap: PerfumeMap = {};
const fragMap: PerfumeMap = {};
const concentMap: PerfumeMap = {};

async function doJob() {
  await getPerfumesByBrand;
  await getPerfumesByConcent;
  await getPerfumesByFrag;

  const brands: {
    brandName: string;
    brandId: number;
  }[] = [];

  perfumesByBrand.forEach((p) => {
    brandMap[p.perfumeName] = brands.find(
      (b) => b.brandName == p.brandName
    )!!.brandId;
  });

  //   perfumesByFrag.forEach((p) => {
  //     fragMap[p.perfumeName] = p.fragranceName;
  //   });

  //   perfumesByConcent.forEach((p) => {
  //     concentMap[p.perfumeName] = p.concentrationName;
  //   });

  console.log(brandMap, fragMap, concentMap);

  const perfumes: {
    perfumeName: string;
    brandId: number;
    fragId: number;
    concentId: number;
  }[] = [];

  perfumes.forEach((perfume) => {
    const brandId: number = brandMap[perfume.perfumeName];
    perfume.brandId = brandId;
    // save to database
  });
}

doJob();
