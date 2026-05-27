const prisma = require("../prisma/prismaClient");

exports.getLearners = async (req, res) => {
  const learners = await prisma.learner.findMany({
    include: { enrollments: true }
  });

  res.json(learners);
};

exports.createLearner = async (req, res) => {
  const { name, email } = req.body;

  const learner = await prisma.learner.create({
    data: { name, email }
  });

  res.json(learner);
};

exports.updateLearner = async (req, res) => {
  const { id } = req.params;

  const learner = await prisma.learner.update({
    where: { id },
    data: req.body
  });

  res.json(learner);
};

exports.deleteLearner = async (req, res) => {
  const { id } = req.params;

  await prisma.learner.delete({ where: { id } });

  res.json({ message: "Learner deleted" });
};