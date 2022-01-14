const Sequelize = require("sequelize");

module.exports = class Concentration extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        concentrationId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        concentrationName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Concentration",
        tableName: "concentrations",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Concentration.hasMany(db.Perfume, {
      foreignKey: "concentrationId",
      sourceKey: "concentrationId",
    });
  }
};
