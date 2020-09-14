const express = require("express");
const router = express.Router();
const restController = require("../controllers/restController");

router.get("/categories", restController.getCategories);
router.get("/suggestions", restController.getSuggestions);

module.exports = router;