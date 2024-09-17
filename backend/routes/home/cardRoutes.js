const cardController = require("../../controllers/home/cardController");

const router = require("express").Router();

router.post("/home/product/add-to-card", cardController.add_to_cart);

router.get("/home/product/get-card/:userId", cardController.get_card_products);

router.delete(
    "/home/product/delete-product-card/:cart_id",
    cardController.delete_card_products
);
router.put(
    "/home/product/quantity-card-inc/:cart_id",
    cardController.quantity_card_inc
);
router.put(
    "/home/product/quantity-card-des/:cart_id",
    cardController.quantity_card_des
);

router.post("/home/product/add-to-wishlist", cardController.add_wishlist);

router.get("/home/product/get-wishlist/:userId", cardController.get_wishlist);

router.delete(
    "/home/product/remove-product-wishlist/:wishlist_id",
    cardController.remove_product_wishlist
);

module.exports = router;
