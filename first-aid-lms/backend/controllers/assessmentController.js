const prisma = require("../prisma/prismaClient");

exports.getAssessments = async (req, res) => {
  const { moduleId } = req.query;
  const assessments = await prisma.assessment.findMany({
    where: moduleId ? { moduleId } : {},
    include: { questions: { orderBy: { order: 'asc' } } }
  });
  res.json(assessments);
};

exports.getAssessmentById = async (req, res) => {
  const { id } = req.params;
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: 'asc' } } }
  });
  res.json(assessment);
};

exports.createAssessment = async (req, res) => {
  const { title, moduleId, passingScore } = req.body;

  const assessment = await prisma.assessment.create({
    data: { title, moduleId, passingScore: passingScore || 70 }
  });

  res.json(assessment);
};

exports.updateAssessment = async (req, res) => {
  const { id } = req.params;

  const assessment = await prisma.assessment.update({
    where: { id },
    data: req.body
  });

  res.json(assessment);
};

exports.deleteAssessment = async (req, res) => {
  const { id } = req.params;

  await prisma.assessment.delete({ where: { id } });

  res.json({ message: "Assessment deleted" });
};
