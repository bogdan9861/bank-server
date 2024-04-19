const { prisma } = require("../prisma/prisma-client");

const get = async (req, res) => {
  try {
    const history = await prisma.history.findMany({
      where: {
        userId: req.user.id,
      },
    });

    if (history) {
      res.status(200).json(history.reverse());
    } else {
      res.status(404).json({ message: "Не удалось найти" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

module.exports = {
  get,
};
