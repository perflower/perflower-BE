const Sequelize = require("sequelize");

module.exports = class Fragrance extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                fragId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fragName: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fragImgUrl: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fragDescription: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "Fragrance",
                tableName: "fragrances",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
        db.Fragrance.hasMany(db.Perfume, {
            foreignKey: "fragId",
            sourceKey: "fragId",
            constraints: false,
        });
    }
};
