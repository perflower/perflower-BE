const express = require("express");
const { Perfume } = require("../../models");
const byBrandFilePath = "./relation/perfumesByBrand.cvs";
const byConcentFilePath = "./relation/perfumesByConcent.cvs";
const byFragFilePath = "./relation/perfumesByFrag.cvs";
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

getPerfumes();

module.exports = { getPerfumes };
