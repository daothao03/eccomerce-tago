const productController = require("../../controllers/dashboard/productController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = require("express").Router();

//POST
router.post("/product-add", authMiddleware, productController.add_product);

//GET :all
router.get("/products-get", authMiddleware, productController.get_products);

//GET :id
router.get(
    "/product-get/:productId",
    authMiddleware,
    productController.get_product
);

//UPDATE
router.put("/update-product", authMiddleware, productController.update_product);
router.put(
    "/update-image-product",
    authMiddleware,
    productController.update_image_product
);

module.exports = router;
