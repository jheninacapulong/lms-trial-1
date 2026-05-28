const prisma = require("../prisma/prismaClient");

// GET MODULES
exports.getModules = async (req, res) => {
  try {
    const modules = await prisma.module.findMany();

    return res.json(modules);
  } catch (error) {
    console.error("getModules error:", error);
    return res.status(500).json({ error: "Failed to fetch modules" });
  }
};

// CREATE MODULE
exports.createModule = async (req, res) => {
  try {
    const { title, order, courseId } = req.body;

    const parsedOrder =
      order === undefined || order === null || order === ""
        ? 0
        : Number(order);

    const module = await prisma.module.create({
      data: {
        title,
        order: Number.isNaN(parsedOrder) ? 0 : parsedOrder,
        courseId
      }
    });

    return res.json(module);
  } catch (error) {
    console.error("createModule error:", error);
    return res.status(500).json({ error: "Failed to create module" });
  }
};

// UPDATE MODULE
exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.update({
      where: { id },
      data: req.body
    });

    return res.json(module);
  } catch (error) {
    console.error("updateModule error:", error);
    return res.status(500).json({ error: "Failed to update module" });
  }
};

// DELETE MODULE
exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.module.delete({ where: { id } });

    return res.json({ message: "Module deleted" });
  } catch (error) {
    console.error("deleteModule error:", error);
    return res.status(500).json({ error: "Failed to delete module" });
  }
};