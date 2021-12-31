const Sequelize = require("sequelize");

module.exports = class Fragrance extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {},
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "Fragrance",
                tableName: "fragrances",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {}
};
