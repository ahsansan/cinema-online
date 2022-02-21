"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbUser.hasMany(models.tbTransaction, {
        as: "transaction",
        foreignKey: {
          name: "id",
        },
      });
      tbUser.belongsToMany(models.tbFilm, {
        as: "filmUser",
        // through is required in this association
        through: {
          model: "tbTransaction", // this is "bridge" table
          as: "bridge",
        },
        foreignKey: "idUser",
      });
    }
  }
  tbUser.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      image: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "tbUser",
    }
  );
  return tbUser;
};
