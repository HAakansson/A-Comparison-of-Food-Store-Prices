const express = require("express");
const router = express.Router();
const restController = require("../controllers/restController");

router.post("/shoppingLists-create", restController.postCreateShoppingList);
router.post("/shoppingLists", restController.postShoppingList);
router.post("/shoppingLists/:shoppingListId", restController.postRowToList);
router.get("/categories", restController.getCategories);
router.get("/productSuggestions", restController.getProductSuggestions);
router.get("/brandSuggestions", restController.getBrandSuggestions);
router.get("/dietaryRestrictions", restController.getDietaryRestrictions);
router.post("/shoppingList", restController.postShoppingList);
router.get("/products/:productId", restController.getProductsById);

router.get("/shoppingLists", restController.getAllShoppingLists);
router.get("/shoppingLists/:shoppingListId", restController.getSingleShoppingList);
router.get("/shoppingLists/row/:rowId", restController.getNewRowFromShoppingList)
router.delete("/shoppingList/row/:rowId", restController.deleteRowFromList)
router.delete("/shoppingLists/:shoppingListId", restController.deleteShoppingList)

module.exports = router;
