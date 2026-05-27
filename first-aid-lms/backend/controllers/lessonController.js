const prisma = require("../prisma/prismaClient");

exports.getLessons = async (req, res) => {
  const lessons = await prisma.lesson.findMany();
  res.json(lessons);
};

exports.createLesson = async (req, res) => {
  const { title, content, videoUrl, imageUrl, moduleId } = req.body;

  const lesson = await prisma.lesson.create({
    data: { title, content, videoUrl, imageUrl, moduleId }
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