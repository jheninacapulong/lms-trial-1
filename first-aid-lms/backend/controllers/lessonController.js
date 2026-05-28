const prisma = require("../prisma/prismaClient");

// GET LESSONS
exports.getLessons = async (req, res) => {
  try {
    const { moduleId } = req.query;

    const lessons = await prisma.lesson.findMany({
      where: moduleId ? { moduleId } : undefined,
      orderBy: { order: "asc" }
    });

    return res.json(lessons);
  } catch (error) {
    console.error("getLessons error:", error);
    return res.status(500).json({ error: "Failed to fetch lessons" });
  }
};

// GET LESSON BY ID
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id }
    });

    return res.json(lesson);
  } catch (error) {
    console.error("getLessonById error:", error);
    return res.status(500).json({ error: "Failed to fetch lesson" });
  }
};

// CREATE LESSON
exports.createLesson = async (req, res) => {
  try {
    const { title, content, moduleId, order } = req.body;

    const parsedOrder =
      order === undefined || order === null || order === ""
        ? 0
        : Number(order);

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        moduleId,
        order: Number.isNaN(parsedOrder) ? 0 : parsedOrder
      }
    });

    return res.json(lesson);
  } catch (error) {
    console.error("createLesson error:", error);
    return res.status(500).json({ error: "Failed to create lesson" });
  }
};

// UPDATE LESSON
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.update({
      where: { id },
      data: req.body
    });

    return res.json(lesson);
  } catch (error) {
    console.error("updateLesson error:", error);
    return res.status(500).json({ error: "Failed to update lesson" });
  }
};

// DELETE LESSON
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lesson.delete({ where: { id } });

    return res.json({ message: "Lesson deleted" });
  } catch (error) {
    console.error("deleteLesson error:", error);
    return res.status(500).json({ error: "Failed to delete lesson" });
  }
};