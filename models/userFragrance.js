const Sequelize = require("sequelize");

module.exports = class UserFragrance extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                userFragranceId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fragId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "UserFragrance",
                tableName: "userFragrances",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
        db.UserFragrance.belongsTo(db.User, {
            foreignKey: "userId",
            targetKey: "userId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
        db.UserFragrance.belongsTo(db.Perfume, {
            foreignKey: "fragId",
            targetKey: "fragId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    }
};
