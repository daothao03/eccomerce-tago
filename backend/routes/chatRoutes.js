const chatController = require("../controllers/chat/chatController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post(
    "/chat/customer/add-customer-friend",
    chatController.add_customer_friend
);

router.post(
    "/chat/customer/send-message-to-seller",
    chatController.customer_send_message
);
router.get(
    "/chat/seller/get-customers/:sellerId",
    chatController.get_customers
);
router.get(
    "/chat/seller/get-messages-customer/:customerId",
    authMiddleware,
    chatController.get_message_customers
);
router.post(
    "/chat/seller/seller-send-message-to-customer",
    authMiddleware,
    chatController.seller_send_message_to_customer
);

router.get(
    "/chat/admin/get-sellers",
    authMiddleware,
    chatController.get_sellers
);

router.post(
    "/chat/admin/send-message-seller-admin",
    authMiddleware,
    chatController.send_message_seller_admin
);
router.get(
    "/chat/get-admin-messages/:receiverId",
    authMiddleware,
    chatController.get_admin_messages
);

router.get(
    "/chat/get-seller-messages/:receiverId",
    authMiddleware,
    chatController.get_seller_messages
);

module.exports = router;
