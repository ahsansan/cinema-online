"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbCategory.hasMany(models.tbFilm, {
        as: "film",
        foreignKey: {
          name: "idCategory",
        },
      });
    }
  }
  tbCategory.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tbCategory",
    }
  );
  return tbCategory;
};
