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
                    type: Sequelize.STRING(200),
                    allowNull: false,
                },
                price: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                likeCnt: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                reviewCnt: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                imgUrl: {
                    type: Sequelize.STRING(200),
                    allowNull: false,
                },
                originImgUrl: {
                    type: Sequelize.STRING(200),
                    allowNull: false,
                },
                starRatingAvg: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                indexSecualAvg: {
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
                seasonSpring: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                seasonSummer: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                seasonFall: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                seasonWinter: {
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
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {
        //향 카테고리 1:N
        db.Perfume.belongsTo(db.Fragrance, {
            foreignKey: "fragId",
            targetKey: "fragId",
        });
        //브랜드 카테고리 1:N
        db.Perfume.belongsTo(db.Brand, {
            foreignKey: "brandId",
            targetKey: "brandId",
        });
        //농도 카테고리 1:N
        db.Perfume.belongsTo(db.Concentration, {
            foreignKey: "concentrationId",
            targetKey: "concentrationId",
        });
        //향수 좋아요 N:M -> 1:N, N:1
        db.Perfume.hasMany(db.PerfumeLike, {
            foreignKey: "perfumeId",
            sourceKey: "perfumeId",
        });
    }
};
