const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
};
