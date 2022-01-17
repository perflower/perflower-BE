const Sequelize = require("sequelize");

module.exports = class Brand extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        brandId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        brandName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        engBrandName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Brand",
        tableName: "brands",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Brand.hasMany(db.Perfume, {
      foreignKey: "brandId",
      sourceKey: "brandId",
    });
  }
};
