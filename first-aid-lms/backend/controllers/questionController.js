const prisma = require("../prisma/prismaClient");

exports.getQuestions = async (req, res) => {
  const { assessmentId } = req.query;
  const questions = await prisma.question.findMany({
    where: assessmentId ? { assessmentId } : {},
    orderBy: { order: 'asc' }
  });
  res.json(questions);
};

exports.getQuestionById = async (req, res) => {
  const { id } = req.params;
  const question = await prisma.question.findUnique({
    where: { id }
  });
  res.json(question);
};

exports.createQuestion = async (req, res) => {
  const { assessmentId, type, questionText, options, correctAnswer, order } = req.body;

  const question = await prisma.question.create({
    data: {
      assessmentId,
      type,
      questionText,
      options,
      correctAnswer,
      order: order || 0
    }
  });

  res.json(question);
};

exports.updateQuestion = async (req, res) => {
  const { id } = req.params;

  const question = await prisma.question.update({
    where: { id },
    data: req.body
  });

  res.json(question);
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;

  await prisma.question.delete({ where: { id } });

  res.json({ message: "Question deleted" });
};
