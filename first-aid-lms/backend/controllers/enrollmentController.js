const prisma = require("../prisma/prismaClient");

exports.getEnrollments = async (req, res) => {
  const data = await prisma.enrollment.findMany({
    include: { learner: true, course: true }
  });

  res.json(data);
};

exports.createEnrollment = async (req, res) => {
  const { learnerId, courseId } = req.body;

  const enrollment = await prisma.enrollment.create({
    data: { learnerId, courseId }
  });

  res.json(enrollment);
};

exports.updateEnrollment = async (req, res) => {
  const { id } = req.params;

  const updated = await prisma.enrollment.update({
    where: { id },
    data: req.body
  });

  res.json(updated);
};

exports.deleteEnrollment = async (req, res) => {
  const { id } = req.params;

  await prisma.enrollment.delete({ where: { id } });

  res.json({ message: "Enrollment deleted" });
};