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
                kakaoId: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
                userEmail: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                },
                userPassword: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userNickname: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                userImgUrl: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userFrag: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                followingCnt: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
                followerCnt: {
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
                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
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
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
        db.User.hasMany(db.Review, {
            foreignKey: "userId",
            sourceKey: "userId",
            constraints: false,
        });
        db.User.hasMany(db.PerfumeLike, {
            foreignKey: "userId",
            sourceKey: "userId",
            constraints: false,
        });

        db.User.hasMany(db.PerfumeWishList, {
            foreignKey: "userId",
            sourceKey: "userId",
            constraints: false,
        });
        db.User.hasMany(db.ReviewLike, {
            foreignKey: "userId",
            sourceKey: "userId",
            constraints: false,
        });
        db.User.hasMany(db.UserFragrance, {
            foreignKey: "userId",
            sourceKey: "userId",
            constraints: false,
        });
        db.User.belongsToMany(db.User, {
          foreignKey: 'followingId',
          as: 'Followers',
          through: 'Follow',
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
          });
    }
};
