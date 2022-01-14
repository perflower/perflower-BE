const Sequelize = require("sequelize");

module.exports = class PerfumeLike extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                perfumeLikeId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
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
                modelName: "PerfumeLike",
                tableName: "perfumeLikes",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
        db.PerfumeLike.belongsTo(db.Perfume, {
            foreignKey: "perfumeId",
            targetKey: "perfumeId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        db.PerfumeLike.belongsTo(db.User, {
            foreignKey: "userId",
            targetKey: "userId",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    }
};
