const Sequelize = require("sequelize");

module.exports = class PerfumeWishList extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                perfumeWishListId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                perfumeId: {
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
                modelName: "PerfumeWishList",
                tableName: "perfumeWishLists",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
        db.PerfumeWishList.belongsTo(db.Perfume, {
            foreignKey: "perfumeId",
            targetKey: "perfumeId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        db.PerfumeWishList.belongsTo(db.User, {
            foreignKey: "userId",
            targetKey: "userId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    }
};
