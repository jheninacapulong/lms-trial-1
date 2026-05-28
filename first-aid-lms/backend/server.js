const express = require("express");
const cors = require("cors");
require("dotenv").config();

const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const questionRoutes = require("./routes/questionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

console.log("SERVER VERSION: DASHBOARD FIX ACTIVE");
// Allow frontend (LOCAL + VERCEL)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://lms-trial-1-mj0q46mtw-jheninacapulongs-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.json({ message: "LMS API Running" });
});

/* ---------------- ERROR HANDLER (MUST BE LAST) ---------------- */

app.use(errorMiddleware);

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});