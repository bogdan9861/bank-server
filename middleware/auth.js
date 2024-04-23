const { prisma } = require("../prisma/prisma-client");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.decode(token, "Mz5y)_ulhzUqAT4spHC1fRn`|.Slo7");

    console.log(decoded);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    console.log(user);

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: "Не авторизован" });
  }
};

module.exports = { auth };
