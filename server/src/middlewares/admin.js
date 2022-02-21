const jwt = require("jsonwebtoken");

exports.admin = (req, res, next) => {
  try {
    //   Ambil dan split
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    // Jika token salah / tidak ada
    if (!token) {
      return res.status(401).send({
        message: "Invalid Token",
      });
    }

    const secretKey = process.env.SECRET_KEY;

    const verified = jwt.verify(token, secretKey);

    req.user = verified;

    if (verified.role === "admin") {
      return (
        (req.user.id = verified.id), (req.user.role = verified.role), next()
      );
    } else {
      return res.status(403).send({
        status: "Failed",
        message: "You don't have authorization",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
