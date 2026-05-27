const express = require("express");
const router = express.Router();

const controller = require("../controllers/learnerController");

router.get("/", controller.getLearners);
router.post("/", controller.createLearner);
router.put("/:id", controller.updateLearner);
router.delete("/:id", controller.deleteLearner);

module.exports = router;