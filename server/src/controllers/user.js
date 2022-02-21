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

    // data body
    const data = req.body;

    // cek id
    const checkId = await tbUser.findOne({
      where: {
        id: id,
      },
    });

    // Jika id tidak ada
    if (!checkId) {
      return res.status(400).send({
        status: "failed",
        message: `Id: ${id} not found`,
      });
    }

    const dataUpload = {
      ...data,
      image: req.file.filename,
    };

    // Proses update
    await tbUser.update(dataUpload, {
      where: {
        id: id,
      },
    });

    // Data setelah di update
    let dataUpdate = await tbUser.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      where: {
        id: id,
      },
    });

    dataUpdate = JSON.parse(JSON.stringify(dataUpdate));

    // Mengedit image link
    dataUpdate = {
      ...dataUpdate,
      image: process.env.UPLOAD_PATH + dataUpdate.image,
    };

    // Berhasil update
    res.status(200).send({
      status: "success",
      data: {
        user: dataUpdate,
      },
    });

    // error server
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
    // Mengambil id dari params
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

    // Menghapus data berdasarkan id
    const deleteData = await tbUser.destroy({
      where: {
        id: id,
      },
    });

    // Jika id tidak ada
    if (!deleteData) {
      return res.status(400).send({
        status: "failed",
        message: "ID not found",
      });
    }

    // Berhasil Menghapus
    res.status(200).send({
      status: `Id ${id} deleted`,

      data: {
        id,
      },
    });

    // Jika error
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
