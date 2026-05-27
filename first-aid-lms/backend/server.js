const express = require("express");
const cors = require("cors");
require("dotenv").config();

const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "LMS API Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const errorMiddleware = require("./middleware/errorMiddleware");

app.use(errorMiddleware);