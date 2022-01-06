const express = require("express");
const { Concentration } = require("../../models");
const csvFilePath = "./concentration/concentration.cvs";
const csv = require("csvtojson");

const concentration = csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => {
            Concentration.create({
                concentrationName: a.concentrationName,
            });
        });
    });

module.exports = { concentration };
