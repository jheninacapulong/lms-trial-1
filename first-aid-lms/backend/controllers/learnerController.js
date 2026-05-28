const prisma = require("../prisma/prismaClient");

// GET ALL LEARNERS
exports.getLearners = async (req, res) => {
  try {
    const learners = await prisma.learner.findMany({
      include: { enrollments: true }
    });

    return res.json(learners);
  } catch (error) {
    console.error("getLearners error:", error);
    return res.status(500).json({ error: "Failed to fetch learners" });
  }
};

// CREATE LEARNER
exports.createLearner = async (req, res) => {
  try {
    const { name, email } = req.body;

    const learner = await prisma.learner.create({
      data: { name, email }
    });

    return res.json(learner);
  } catch (error) {
    console.error("createLearner error:", error);
    return res.status(500).json({ error: "Failed to create learner" });
  }
};

// UPDATE LEARNER
exports.updateLearner = async (req, res) => {
  try {
    const { id } = req.params;

    const learner = await prisma.learner.update({
      where: { id },
      data: req.body
    });

    return res.json(learner);
  } catch (error) {
    console.error("updateLearner error:", error);
    return res.status(500).json({ error: "Failed to update learner" });
  }
};

// DELETE LEARNER
exports.deleteLearner = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.learner.delete({ where: { id } });

    return res.json({ message: "Learner deleted" });
  } catch (error) {
    console.error("deleteLearner error:", error);
    return res.status(500).json({ error: "Failed to delete learner" });
  }
};