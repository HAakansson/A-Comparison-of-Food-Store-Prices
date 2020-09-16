const express = require("express");
const router = express.Router();
const restController = require("../controllers/restController");

router.get("/categories", restController.getCategories);
router.get("/products/:productId", restController.getProductsById);


module.exports = router;