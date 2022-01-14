const Sequelize = require("sequelize");

module.exports = class Review extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        reviewId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        perfumeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        reviewLikeCnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        starRating: {
          type: Sequelize.FLOAT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        indexSexual: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 5,
        },
        indexTone: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 5,
        },
        indexBody: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 5,
        },
        indexDesign: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        seasonSpring: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 0,
        },
        seasonSummer: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 0,
        },
        seasonFall: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 0,
        },
        seasonWinter: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("now()"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Review",
        tableName: "reviews",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Review.hasMany(db.ReviewLike, {
      foreignKey: "reviewId",
      sourceKey: "reviewId",
      constraints: false,
    });
    db.Review.belongsTo(db.Perfume, {
      foreignKey: "perfumeId",
      targetKey: "perfumeId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    db.Review.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "userId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  }
};
