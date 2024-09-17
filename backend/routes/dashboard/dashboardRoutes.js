const dashboardController = require("../../controllers/dashboard/dashboardController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = require("express").Router();

router.get(
    "/admin/get-admin-dashboard-data",
    authMiddleware,
    dashboardController.get_admin_dashboard_data
);
router.get(
    "/admin/get-seller-dashboard-data",
    authMiddleware,
    dashboardController.get_seller_dashboard_data
);
router.post("/add-banner", authMiddleware, dashboardController.add_banner);
router.get("/get-banners", authMiddleware, dashboardController.get_banners);
router.put(
    "/banner-status/update/:bannerId",
    authMiddleware,
    dashboardController.banner_status_update
);
router.delete(
    "/delete_banner/:bannerId",
    authMiddleware,
    dashboardController.delete_banner
);

module.exports = router;
