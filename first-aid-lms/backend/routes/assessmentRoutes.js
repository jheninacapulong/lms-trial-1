const express = require("express");
const router = express.Router();

const controller = require("../controllers/assessmentController");

router.get("/", controller.getAssessments);
router.get("/:id", controller.getAssessmentById);
router.post("/", controller.createAssessment);
router.put("/:id", controller.updateAssessment);
router.delete("/:id", controller.deleteAssessment);

module.exports = router;
