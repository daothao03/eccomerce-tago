const sellerController = require("../../controllers/dashboard/sellerController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = require("express").Router();

router.get(
    "/get-sellers-request",
    authMiddleware,
    sellerController.get_sellers
);

//GET :id
router.get(
    "/get-seller/:sellerId",
    authMiddleware,
    sellerController.get_seller
);
//PUT status :id
router.put(
    "/update-status-seller",
    authMiddleware,
    sellerController.update_status_seller
);

router.get(
    "/get-active-seller",
    authMiddleware,
    sellerController.get_active_sellers
);

router.get(
    "/get-deactive-seller",
    authMiddleware,
    sellerController.get_deactive_sellers
);

module.exports = router;
