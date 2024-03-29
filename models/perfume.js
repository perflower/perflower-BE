const Sequelize = require("sequelize");

module.exports = class Perfume extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        perfumeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        fragId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        brandId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        concentrationId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        perfumeName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        likeBoolean: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        likeCnt: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        reviewCnt: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        imgUrl: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        originImgUrl: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        starRatingAvg: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        indexSexualAvg: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        indexToneAvg: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        indexBodyAvg: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        indexDesignAvg: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        seasonSpringCnt: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        seasonSummerCnt: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        seasonFallCnt: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        seasonWinterCnt: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Perfume",
        tableName: "perfumes",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    //향수 좋아요 N:M -> 1:N, N:1
    db.Perfume.hasMany(db.PerfumeLike, {
      foreignKey: "perfumeId",
      sourceKey: "perfumeId",
      constraints: false,
    });

    db.Perfume.hasMany(db.Review, {
      foreignKey: "perfumeId",
      sourceKey: "perfumeId",
      constraints: false,
    });

    db.Perfume.hasMany(db.ReviewLike, {
      foreignKey: "perfumeId",
      sourceKey: "perfumeId",
      constraints: false,
    });

    //향 카테고리 1:N
    db.Perfume.belongsTo(db.Fragrance, {
      foreignKey: "fragId",
      targetKey: "fragId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    //농도 카테고리 1:N
    db.Perfume.belongsTo(db.Concentration, {
      foreignKey: "concentrationId",
      targetKey: "concentrationId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    //브랜드 카테고리 1:N
    db.Perfume.belongsTo(db.Brand, {
      foreignKey: "brandId",
      targetKey: "brandId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  }
};
