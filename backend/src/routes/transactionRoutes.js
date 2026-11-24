const express = require("express");
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", transactionController.getSummary);
router.get("/", transactionController.getAll);
router.post("/", transactionController.create);
router.put("/:id", transactionController.update);
router.delete("/:id", transactionController.remove);

module.exports = router;
