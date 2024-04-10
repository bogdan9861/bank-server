const { prisma } = require("../prisma/prisma-client");
const { getDate } = require("../utils/getDate");

const get = async (req, res) => {
  try {
    const card = await prisma.card.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    console.log(card);

    if (card) {
      res.status(200).json(card);
    } else {
      res.status(404).json({ message: "Не найдено" });
    }
  } catch (error) {}
};

const add = async (req, res) => {
  try {
    const { code, date, cvv } = req.body;

    if (!code || !date || !cvv) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const cards = await prisma.card.findMany({
      where: {
        userId: req.user.id,
      },
    });

    if (cards.length > 0)
      return res
        .status(400)
        .json({ message: "Карта уже добавлена для этого пользователя" });

    const card = await prisma.card.create({
      data: {
        date,
        code,
        cvv: Number(cvv),
        ballance: "0",
        userId: req.user.id,
      },
    });

    if (card) {
      res.status(201).json(card);
    } else {
      res.status(400).json("Не удалось добавить карту");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ message: "Не удалось определить id карты" });

    const card = await prisma.card.delete({
      where: {
        id,
      },
    });

    if (card) {
      res.status(200).json(card);
    } else {
      res.status(404).json({ message: "Не удалось найти" });
    }
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const transaction = async (req, res) => {
  try {
    const { phoneNumber, sum, reason } = req.body;

    if (!phoneNumber || !sum) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const userTo = await prisma.user.findFirst({
      where: {
        phoneNumber,
      },
    });

    if (userTo === null) {
      return res
        .status(400)
        .json({ message: "Не удалось найти пользователя с таким номером" });
    }

    const cardFrom = await prisma.card.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    const cardTo = await prisma.card.findFirst({
      where: {
        userId: userTo.id,
      },
    });

    if (+cardTo.ballance + +sum > 100000000) {
      return res.status(400).json({ message: "Превышен допустимый лимит" });
    }

    if (cardFrom.userId === cardTo.userId) {
      return res
        .status(400)
        .json({ message: "Перевод самому себе не возможен" });
    }

    if (cardFrom && cardTo && userTo) {
      if (+cardFrom.ballance >= +sum) {
        const fromBallance = +cardFrom.ballance - +sum;
        const toBallance = +cardTo.ballance + +sum;

        const newCardFrom = await prisma.card.update({
          where: {
            id: cardFrom.id,
          },
          data: {
            ...cardFrom,
            ballance: fromBallance + "",
          },
        });

        const newCardTo = await prisma.card.update({
          where: {
            id: cardTo.id,
          },
          data: {
            ...cardTo,
            ballance: toBallance + "",
          },
        });

        await prisma.history.create({
          data: {
            userId: userTo.id,
            sender: req.user.name,
            recipient: "Вы",
            sum,
            time: getDate().getTime(),
            date: getDate().getCurrentDate(),
            reason: reason || "without reason",
          },
        });

        await prisma.history.create({
          data: {
            userId: req.user.id,
            sender: "Вы",
            recipient: userTo.name,
            sum,
            time: getDate().getTime(),
            date: getDate().getCurrentDate(),
            reason: reason || "without reason",
          },
        });

        res.status(200).json({ newCardFrom, newCardTo });
      } else {
        res.status(400).json({ message: "Недостаточно средств" });
      }
    } else {
      res.status(404).json({ message: "Не удалось найти" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const topUp = async (req, res) => {
  try {
    const { sum } = req.body;

    if (!sum) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const cardData = await prisma.card.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    if (+cardData.ballance + +sum > 100000000) {
      return res.status(400).json({ message: "Превышен допустимый лимит" });
    }

    const card = await prisma.card.update({
      where: {
        id: cardData.id,
      },
      data: {
        ...cardData,
        ballance: +cardData.ballance + +sum + "",
      },
    });

    if (card) {
      res.status(201).json(card);
    } else {
      res.status(404).json({ message: "Не удалось найти" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

module.exports = {
  get,
  add,
  remove,
  transaction,
  topUp,
};
