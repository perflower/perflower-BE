const Sequelize = require("sequelize");
const User = require("./user");
const Review = require("./review");
const Perfume = require("./perfume");
const Fragrance = require("./fragrance");
const Brand = require("./brand");
const Concentration = require("./concentration");

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
db.Perfume = Perfume;
db.Fragrance = Fragrance;
db.Brand = Brand;
db.Concentration = Concentration;

User.init(sequelize);
Review.init(sequelize);
Perfume.init(sequelize);
Fragrance.init(sequelize);
Brand.init(sequelize);
Concentration.init(sequelize);

User.associate(db);
Review.associate(db);
Perfume.associate(db);
Fragrance.associate(db);
Brand.associate(db);
Concentration.associate(db);

db.sequelize = sequelize;

module.exports = db;
