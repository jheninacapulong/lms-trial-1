const express = require("express");
const router = express.Router();

const controller = require("../controllers/courseController");

router.get("/", controller.getCourses);
router.post("/", controller.createCourse);
router.put("/:id", controller.updateCourse);
router.delete("/:id", controller.deleteCourse);

module.exports = router;