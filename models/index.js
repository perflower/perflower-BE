const Sequelize = require("sequelize");
const User = require("./user");
const Review = require("./review");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")[env];

const db = {};
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.sequelize = sequelize;

db.User = User;
db.Review = Review;

User.init(sequelize);
Review.init(sequelize);

User.associate(db);
Review.associate(db);

module.exports = db;
