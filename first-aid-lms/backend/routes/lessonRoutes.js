const express = require("express");
const router = express.Router();

const controller = require("../controllers/lessonController");

router.get("/", controller.getLessons);
router.post("/", controller.createLesson);
router.put("/:id", controller.updateLesson);
router.delete("/:id", controller.deleteLesson);

module.exports = router;