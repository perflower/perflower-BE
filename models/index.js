const Sequelize = require("sequelize");
const User = require("./user");
const Review = require("./review");
const Perfume = require("./perfume");
const Fragrance = require("./fragrance");
const Brand = require("./brand");
const Concentration = require("./concentration");
const PerfumeLike = require("./perfumeLike");
const ReviewLike = require("./reviewLike");
const UserFragrance = require("./userFragrance");
const Follow = require("./follow");
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
db.PerfumeLike = PerfumeLike;
db.ReviewLike = ReviewLike;
db.UserFragrance = UserFragrance;
db.Follow = Follow;

User.init(sequelize);
Review.init(sequelize);
Perfume.init(sequelize);
Fragrance.init(sequelize);
Brand.init(sequelize);
Concentration.init(sequelize);
PerfumeLike.init(sequelize);
ReviewLike.init(sequelize);
UserFragrance.init(sequelize);
Follow.init(sequelize);

User.associate(db);
Review.associate(db);
Perfume.associate(db);
Fragrance.associate(db);
Brand.associate(db);
Concentration.associate(db);
PerfumeLike.associate(db);
ReviewLike.associate(db);
UserFragrance.associate(db);
Follow.associate(db);

db.sequelize = sequelize;

module.exports = db;
