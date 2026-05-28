const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * DASHBOARD STATS (cards)
 * GET /api/dashboard/stats
 */
router.get("/stats", async (req, res) => {
  try {
    const [
      totalCourses,
      totalModules,
      totalLessons,
      totalLearners,
      totalEnrollments,
      completedEnrollments
    ] = await Promise.all([
      prisma.course.count(),
      prisma.module.count(),
      prisma.lesson.count(),
      prisma.learner.count(),
      prisma.enrollment.count(),
      prisma.enrollment.count({
        where: { completed: true }
      })
    ]);

    const completionRate =
      totalEnrollments === 0
        ? 0
        : Math.round((completedEnrollments / totalEnrollments) * 100);

    res.json({
      totalCourses,
      totalModules,
      totalLessons,
      totalLearners,
      totalEnrollments,
      completedEnrollments,
      completionRate
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

/**
 * DASHBOARD OVERVIEW (for charts later)
 * GET /api/dashboard/overview
 */
router.get("/overview", async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      select: {
        progress: true,
        createdAt: true
      }
    });

    const avgProgress =
      enrollments.length === 0
        ? 0
        : Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) /
              enrollments.length
          );

    // simple grouping by progress buckets (for chart)
    const progressBuckets = {
      "0-25": 0,
      "26-50": 0,
      "51-75": 0,
      "76-100": 0
    };

    enrollments.forEach((e) => {
      if (e.progress <= 25) progressBuckets["0-25"]++;
      else if (e.progress <= 50) progressBuckets["26-50"]++;
      else if (e.progress <= 75) progressBuckets["51-75"]++;
      else progressBuckets["76-100"]++;
    });

    res.json({
      avgProgress,
      progressBuckets
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load overview" });
  }
});

module.exports = router;