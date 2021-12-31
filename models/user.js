const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                userEmail: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                    unique: true,
                },
                userPassword: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                userNickname: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                userImgUrl: {
                    type: Sequelize.STRING(500),
                    allowNull: true,
                },
                userFrag: {
                    type: Sequelize.STRING(45),
                    allowNull: true,
                },
                followingCnt: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
                follwerCnt: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
                likePerfumeCnt: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
                userReviewCnt: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
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
                modelName: "User",
                tableName: "users",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {}
};
