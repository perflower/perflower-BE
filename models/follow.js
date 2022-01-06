const Sequelize = require("sequelize");

module.exports = class Follow extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                followId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                followerId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                followingId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "Follow",
                tableName: "follows",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }

    static associate(db) {
        db.Follow.belongsTo(db.User, {
            foreignKey: "followerId",
            targetKey: "userId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
        db.Follow.belongsTo(db.User, {
            foreignKey: "followingId",
            targetKey: "userId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    }
};
