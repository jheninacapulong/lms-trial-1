const prisma = require("../prisma/prismaClient");

// GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { modules: true }
    });

    return res.json(courses);
  } catch (error) {
    console.error("getCourses error:", error);
    return res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// GET COURSE BY ID WITH MODULES AND LESSONS
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
            assessments: {
              include: {
                questions: { orderBy: { order: "asc" } }
              }
            }
          }
        },
        enrollments: true
      }
    });

    return res.json(course);
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({ error: "Failed to fetch course" });
  }
};

// CREATE COURSE
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, category } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        category
      }
    });

    return res.json(course);
  } catch (error) {
    console.error("createCourse error:", error);
    return res.status(500).json({ error: "Failed to create course" });
  }
};

// UPDATE COURSE
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.update({
      where: { id },
      data: req.body
    });

    return res.json(course);
  } catch (error) {
    console.error("updateCourse error:", error);
    return res.status(500).json({ error: "Failed to update course" });
  }
};

// DELETE COURSE
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.course.delete({ where: { id } });

    return res.json({ message: "Course deleted" });
  } catch (error) {
    console.error("deleteCourse error:", error);
    return res.status(500).json({ error: "Failed to delete course" });
  }
};

// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const [coursesCount, modulesCount, lessonsCount, learnersCount] =
      await Promise.all([
        prisma.course.count(),
        prisma.module.count(),
        prisma.lesson.count(),
        prisma.learner.count()
      ]);

    return res.json({
      totalCourses: coursesCount,
      totalModules: modulesCount,
      totalLessons: lessonsCount,
      totalLearners: learnersCount
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
};