const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// router.get("/something", apiController.getSomething);
router.get("/products", apiController.getProducts)

module.exports = router;
