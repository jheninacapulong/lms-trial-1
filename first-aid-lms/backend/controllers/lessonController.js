const prisma = require("../prisma/prismaClient");

exports.getLessons = async (req, res) => {
  const { moduleId } = req.query;
  const lessons = await prisma.lesson.findMany({
    where: moduleId ? { moduleId } : {},
    orderBy: { order: 'asc' }
  });
  res.json(lessons);
};

exports.getLessonById = async (req, res) => {
  const { id } = req.params;
  const lesson = await prisma.lesson.findUnique({
    where: { id }
  });
  res.json(lesson);
};

exports.createLesson = async (req, res) => {
  const { title, content, moduleId, order } = req.body;
  const parsedOrder = order === undefined || order === null || order === "" ? 0 : Number(order);

  const lesson = await prisma.lesson.create({
    data: {
      title,
      content,
      moduleId,
      order: Number.isNaN(parsedOrder) ? 0 : parsedOrder,
    }
  });

  res.json(lesson);
};

exports.updateLesson = async (req, res) => {
  const { id } = req.params;

  const lesson = await prisma.lesson.update({
    where: { id },
    data: req.body
  });

  res.json(lesson);
};

exports.deleteLesson = async (req, res) => {
  const { id } = req.params;

  await prisma.lesson.delete({ where: { id } });

  res.json({ message: "Lesson deleted" });
};