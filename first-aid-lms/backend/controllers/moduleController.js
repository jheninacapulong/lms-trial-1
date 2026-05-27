const prisma = require("../prisma/prismaClient");

exports.getModules = async (req, res) => {
  const modules = await prisma.module.findMany();
  res.json(modules);
};

exports.createModule = async (req, res) => {
  const { title, order, courseId } = req.body;
  const parsedOrder = order === undefined || order === null || order === "" ? 0 : Number(order);

  const module = await prisma.module.create({
    data: {
      title,
      order: Number.isNaN(parsedOrder) ? 0 : parsedOrder,
      courseId,
    }
  });

  res.json(module);
};

exports.updateModule = async (req, res) => {
  const { id } = req.params;

  const module = await prisma.module.update({
    where: { id },
    data: req.body
  });

  res.json(module);
};

exports.deleteModule = async (req, res) => {
  const { id } = req.params;

  await prisma.module.delete({ where: { id } });

  res.json({ message: "Module deleted" });
};