const prisma = require("../prisma/prismaClient");

// GET ALL COURSES
exports.getCourses = async (req, res) => {
  const courses = await prisma.course.findMany({
    include: { modules: true }
  });
  res.json(courses);
};

// CREATE COURSE
exports.createCourse = async (req, res) => {
  const { title, description, thumbnail, category, duration } = req.body;

  const course = await prisma.course.create({
    data: { title, description, thumbnail, category, duration }
  });

  res.json(course);
};

// UPDATE COURSE
exports.updateCourse = async (req, res) => {
  const { id } = req.params;

  const course = await prisma.course.update({
    where: { id },
    data: req.body
  });

  res.json(course);
};

// DELETE COURSE
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  await prisma.course.delete({ where: { id } });

  res.json({ message: "Course deleted" });
};