const { tbUser } = require("../../models");
const fs = require("fs");

exports.getUsers = async (req, res) => {
  try {
    const dataUser = await tbUser.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "role"],
      },
    });
    res.status(200).send({
      status: "success",
      data: { user: dataUser },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const dataUser = await tbUser.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "role"],
      },
    });

    if (!dataUser) {
      return res.status(403).send({
        status: "failed",
        message: "data not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: {
        user: dataUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const checkId = await tbUser.findOne({
      where: {
        id: id,
      },
    });

    if (!checkId) {
      return res.status(400).send({
        status: "failed",
        message: `Id: ${id} not found`,
      });
    }

    const dataUpload = {
      ...data,
      image: process.env.UPLOAD_PATH + req.file.filename,
    };

    await tbUser.update(dataUpload, {
      where: {
        id: id,
      },
    });

    let dataUpdate = await tbUser.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      where: {
        id: id,
      },
    });

    dataUpdate = JSON.parse(JSON.stringify(dataUpdate));

    res.status(200).send({
      status: "success",
      data: {
        user: dataUpdate,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const checkId = await tbUser.findOne({
      where: {
        id: id,
      },
    });

    fs.unlink(`uploads/${checkId.image}`, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const deleteData = await tbUser.destroy({
      where: {
        id: id,
      },
    });

    if (!deleteData) {
      return res.status(400).send({
        status: "failed",
        message: "ID not found",
      });
    }

    res.status(200).send({
      status: `Id ${id} deleted`,

      data: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
