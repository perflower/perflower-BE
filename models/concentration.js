const Sequelize = require("sequelize");

module.exports = class Concentration extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {},
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "Concentration",
                tableName: "concentrations",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {}
};
