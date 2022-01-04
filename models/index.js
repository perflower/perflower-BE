const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")[env];
const User = require("./user");
const Perfume = require("./perfume");

const db = {};
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.sequelize = sequelize;

db.User = User;
db.Perfume = Perfume;

User.init(sequelize);
Perfume.init(sequelize);

User.associate(db);
Perfume.associate(db);

db.sequelize = sequelize;

module.exports = db;
