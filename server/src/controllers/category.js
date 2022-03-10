const { tbCategory } = require("../../models");

exports.getCategories = async (req, res) => {
  try {
    const dataCategories = await tbCategory.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["name", "ASC"]],
    });

    res.status(200).send({
      status: "success",
      data: dataCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const checkName = await tbCategory.findOne({
      where: {
        name: name,
      },
    });

    if (checkName) {
      return res.status(403).send({
        status: "Failed",
        message: "Category already Created",
      });
    }

    const dataCategory = await tbCategory.create({
      ...req.body,
    });

    res.status(200).send({
      status: "success",
      data: dataCategory.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const findCategory = await tbCategory.findOne({
      where: {
        id: id,
      },
    });

    if (!findCategory) {
      return res.status(403).send({
        status: "failed",
        message: "data not found",
      });
    }

    const dataCategory = {
      ...req.body,
    };

    await tbCategory.update(dataCategory, {
      where: {
        id: id,
      },
    });

    const updateCategory = await tbCategory.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });

    res.status(200).send({
      status: "Success",
      data: updateCategory,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const findCategory = await tbCategory.findOne({
      where: {
        id: id,
      },
    });

    if (!findCategory) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }

    await tbCategory.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).send({
      status: `${findCategory.name} deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
