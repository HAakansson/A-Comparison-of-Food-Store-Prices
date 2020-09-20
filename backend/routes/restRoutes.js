const express = require("express");
const router = express.Router();
const restController = require("../controllers/restController");

router.get("/categories", restController.getCategories);
router.get("/dietaryRestrictions", restController.getDietaryRestrictions);
router.post("/shoppingList", restController.postShoppingList);

module.exports = router;