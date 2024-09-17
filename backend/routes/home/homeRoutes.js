const homeController = require("../../controllers/home/homeController");

const router = require("express").Router();

router.get("/get-categories", homeController.get_categories);
router.get("/get-products", homeController.get_products);
router.get("/price-range-product", homeController.price_range_product);
router.get("/query-products", homeController.query_products);

router.get("/get-product-detail/:slug", homeController.get_product_detail);

router.post("/customer/submit-review", homeController.customer_review);
router.get("/customer/get-reviews/:productId", homeController.get_reviews);
router.get("/get-banners", homeController.get_banners);

module.exports = router;
