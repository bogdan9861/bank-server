const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, phoneNumber, password, referal } = req.body;

    // referal system creation part

    if (referal) {
      const referalUser = await prisma.user.findFirst({
        where: {
          referal,
        },
      });

      if (referal) {
        const referalUserCard = await prisma.card.findFirst({
          where: {
            userId: referalUser.id,
          },
        });

        if (referalUserCard) {
          await prisma.card.update({
            where: {
              id: referalUserCard.id,
            },

            data: {
              ...referalUserCard,
              ballance: +referalUserCard.ballance + 1500 + "",
            },
          });
        } else {
          return res.status(404).json({
            message: "Возможно, реферальный пользователь не добавил карту",
          });
        }
      } else {
        return res
          .status(404)
          .json({ message: "Такого реферального кода не существует" });
      }
    }

    // user creation part

    if (!name || !phoneNumber || !password) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const registredUser = await prisma.user.findFirst({
      where: {
        phoneNumber,
      },
    });

    if (registredUser) {
      return res.status(400).json({
        message: "Пользователь с таким номером телефона уже существует",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        password: hashedPassword,
        referal: `${name.toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
      },
    });

    const secret = "Mz5y)_ulhzUqAT4spHC1fRn`|.Slo7";

    if (user && secret) {
      return res.json({
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        referal: user.referal,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      res.status(400).json({ message: "Не удалось создать пользователя" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password)
      return res.status(400).json({ message: "Все поля обязательны" });

    const user = await prisma.user.findFirst({
      where: {
        phoneNumber,
      },
    });

    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    const secret = "Mz5y)_ulhzUqAT4spHC1fRn`|.Slo7";

    if (user && isPasswordCorrect) {
      res.status(200).json({
        name: user.name,
        phoneNumber: user.phoneNumber,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      res
        .status(404)
        .json({ message: "Номер телефона или пароль не совпадают" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const get = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({message: 'Что-то пошло не так'})
  }
};

module.exports = {
  register,
  login,
  get,
};
