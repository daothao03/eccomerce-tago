const orderController = require("../../controllers/order/orderController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/home/order/place-order", orderController.place_order);

router.get(
    "/home/customer/get-data-dashboard/:userId",
    orderController.get_data_dashboard
);

router.get(
    "/home/customer/get-orders/:customerId/:status",
    orderController.get_orders
);

router.get(
    "/home/customer/get-order-detail/:orderId",
    orderController.get_order_detail
);

router.get(
    "/admin/get-admin-orders",
    authMiddleware,
    orderController.get_admin_orders
);

router.get(
    "/admin/get-admin-order/:orderId",
    authMiddleware,
    orderController.get_admin_order
);

router.put(
    "/admin/order-status/update/:orderId",
    orderController.order_update_status
);

router.get(
    "/seller/get-seller-orders/:sellerId",
    authMiddleware,
    orderController.get_seller_orders
);

router.get("/seller/order/:orderId", orderController.get_seller_order);

router.put(
    "/seller/order-status/update/:orderId",
    orderController.seller_order_status_update
);

router.post("/order/create-payment", orderController.create_payment);

router.get("/order/confirm/:orderId", orderController.order_confirm);

module.exports = router;
