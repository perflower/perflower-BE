const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "peflower",
    version: "1.0.0",
    description: "project API",
  },
  host: "perflower.com",
  schemes: ["https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
