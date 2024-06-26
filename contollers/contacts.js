const { prisma } = require("../prisma/prisma-client");

const getAll = async (req, res) => {
  try {
    const contacts = await prisma.contacts.findMany({
      where: {
        userId: req.user.id
      }
    });

    if (contacts) {
      res.status(200).json(contacts);
    } else {
      res.status(404).json({ message: "Нет контактов" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const create = async (req, res) => {
  try {
    const { name, phoneNumber, url = "" } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const contact = await prisma.contacts.create({
      data: {
        name,
        photo: url,
        phoneNumber,
        userId: req.user.id,
      },
    });

    if (contact) {
      res.status(200).json(contact);
    } else {
      res.sattus(404).json({ message: "Не удалось найти" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ message: "Не удалось получить Id контакта" });

    const RemovedContact = await prisma.contacts.delete({
      where: {
        id,
      },
    });

    if (RemovedContact) {
      const contacts = await prisma.contacts.findMany();

      if (contacts) {
        res.status(200).json(contacts)
      } else {
        res.status(404).json({message: 'При получении контактов что-то пошло не так'})
      }
    
    } else {
      res
        .status(404)
        .json({ message: "Не удалось найти контакт для удаления" });
    }
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

module.exports = {
  create,
  getAll,
  remove,
};
