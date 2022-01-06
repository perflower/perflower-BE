const Sequelize = require("sequelize");

module.exports = class ReviewLike extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                reviewLikeId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                reviewId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "ReviewLike",
                tableName: "reviewLikes",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
        db.ReviewLike.belongsTo(db.Review, {
            foreignKey: "reviewId",
            targetKey: "reviewId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        db.ReviewLike.belongsTo(db.User, {
            foreignKey: "userId",
            targetKey: "userId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    }
};
