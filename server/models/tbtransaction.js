"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbTransaction.belongsTo(models.tbFilm, {
        as: "film",
        foreignKey: {
          name: "idFilm",
        },
      });
      tbTransaction.belongsTo(models.tbUser, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  tbTransaction.init(
    {
      idUser: DataTypes.INTEGER,
      idFilm: DataTypes.INTEGER,
      status: DataTypes.STRING,
      accountNumber: DataTypes.STRING,
      transferProof: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tbTransaction",
    }
  );
  return tbTransaction;
};
