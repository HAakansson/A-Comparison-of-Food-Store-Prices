const express = require("express");
const router = express.Router();
const restController = require("../controllers/restController");

router.get("/categories", restController.getCategories);
router.get("/productSuggestions", restController.getProductSuggestions);
router.get("/brandSuggestions", restController.getBrandSuggestions);
router.get("/dietaryRestrictions", restController.getDietaryRestrictions);
router.post("/shoppingList", restController.postShoppingList);
router.get("/products/:productId", restController.getProductsById);


module.exports = router;