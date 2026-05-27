const prisma = require("../prisma/prismaClient");

// GET ALL COURSES
exports.getCourses = async (req, res) => {
  const courses = await prisma.course.findMany({
    include: { modules: true }
  });
  res.json(courses);
};

// GET COURSE BY ID WITH MODULES AND LESSONS
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: { orderBy: { order: 'asc' } },
          assessments: { include: { questions: { orderBy: { order: 'asc' } } } }
        }
      },
      enrollments: true
    }
  });
  res.json(course);
};

// CREATE COURSE
exports.createCourse = async (req, res) => {
  const { title, description, thumbnail, category, duration } = req.body;
  const parsedDuration = duration === undefined || duration === null || duration === "" ? null : Number(duration);

  const course = await prisma.course.create({
    data: {
      title,
      description,
      thumbnail,
      category,
      duration: Number.isNaN(parsedDuration) ? null : parsedDuration,
    }
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

// GET DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  const [coursesCount, modulesCount, lessonsCount, learnersCount] = await Promise.all([
    prisma.course.count(),
    prisma.module.count(),
    prisma.lesson.count(),
    prisma.learner.count()
  ]);

  res.json({
    totalCourses: coursesCount,
    totalModules: modulesCount,
    totalLessons: lessonsCount,
    totalLearners: learnersCount
  });
};