const { tbUser } = require("../../models");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const data = req.body;
    const path = process.env.UPLOAD_PATH;

    const schema = joi.object({
      fullName: joi.string().min(4).required(),
      email: joi.string().email().required(),
      phone: joi.string().min(4).required(),
      password: joi.string().min(6).required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.status(401).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    const checkEmail = await tbUser.findOne({
      where: {
        email: data.email,
      },
    });

    if (checkEmail) {
      return res.status(400).send({
        status: "Failed",
        message: "Email already registered",
      });
    }

    const hashStrenght = 10;
    const hashhedPassword = await bcrypt.hash(data.password, hashStrenght);

    const dataUser = await tbUser.create({
      ...data,
      password: hashhedPassword,
      image: path + "noname.png",
    });

    const tokenData = {
      id: dataUser.id,
      fullName: dataUser.fullName,
      email: dataUser.email,
      role: dataUser.role,
    };
    const secretKey = process.env.SECRET_KEY;

    const token = jwt.sign(tokenData, secretKey);

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          phone: dataUser.phone,
          email: dataUser.email,
          image: dataUser.image,
          role: dataUser.role,
          token,
        },
      },
    });
  } catch (err) {
    //  Jika error
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const data = req.body;

    // Validasi input
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });

    // Deklarasi validasi
    const { error } = schema.validate(data);

    // Jika data tidak valid
    if (error) {
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });
    }

    // Cek Email
    const dataOnTable = await tbUser.findOne({
      where: {
        email: data.email,
      },
    });

    // Jika belum didaftarkan
    if (!dataOnTable) {
      return res.status(400).send({
        status: "failed",
        message: "email and password don't match",
      });
    }

    // Cek Password
    const validatePassword = await bcrypt.compare(
      data.password,
      dataOnTable.password
    );

    // Password Salah
    if (!validatePassword) {
      return res.status(400).send({
        status: "failed",
        message: "email and password don't match",
      });
    }

    // Generate token
    const tokenData = {
      id: dataOnTable.id,
      fullName: dataOnTable.fullName,
      email: dataOnTable.email,
      role: dataOnTable.role,
    };

    const secretKey = process.env.SECRET_KEY;

    const token = jwt.sign(tokenData, secretKey);

    // Jika semuanya berhasil
    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataOnTable.id,
          fullName: dataOnTable.fullName,
          email: dataOnTable.email,
          phone: dataOnTable.phone,
          image: dataOnTable.image,
          role: dataOnTable.role,
          token,
        },
      },
    });
  } catch (err) {
    //  Jika error
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.authUser = async (req, res) => {
  try {
    const id = req.user.id;
    const dataUser = await tbUser.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updateAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "User valid",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.fullName,
          email: dataUser.email,
          image: dataUser.image,
          phone: dataUser.phone,
          role: dataUser.role,
        },
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
