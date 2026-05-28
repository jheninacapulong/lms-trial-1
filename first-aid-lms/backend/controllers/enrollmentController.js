const prisma = require("../prisma/prismaClient");

// GET ALL ENROLLMENTS
exports.getEnrollments = async (req, res) => {
  try {
    const data = await prisma.enrollment.findMany({
      include: { learner: true, course: true }
    });

    return res.json(data);
  } catch (error) {
    console.error("getEnrollments error:", error);
    return res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};

// CREATE ENROLLMENT
exports.createEnrollment = async (req, res) => {
  try {
    const { learnerId, courseId } = req.body;

    const enrollment = await prisma.enrollment.create({
      data: { learnerId, courseId }
    });

    return res.json(enrollment);
  } catch (error) {
    console.error("createEnrollment error:", error);
    return res.status(500).json({ error: "Failed to create enrollment" });
  }
};

// UPDATE ENROLLMENT
exports.updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.enrollment.update({
      where: { id },
      data: req.body
    });

    return res.json(updated);
  } catch (error) {
    console.error("updateEnrollment error:", error);
    return res.status(500).json({ error: "Failed to update enrollment" });
  }
};

// DELETE ENROLLMENT
exports.deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.enrollment.delete({ where: { id } });

    return res.json({ message: "Enrollment deleted" });
  } catch (error) {
    console.error("deleteEnrollment error:", error);
    return res.status(500).json({ error: "Failed to delete enrollment" });
  }
};