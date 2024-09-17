const paymentController = require("../controllers/payment/paymentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.get(
    "/payment/create-momo-connect-account",
    authMiddleware,
    paymentController.create_momo_connect_account
);

router.put(
    "/payment/active-stripe-connect-account/:activeCode",
    authMiddleware,
    paymentController.active_stripe_connect_account
);

router.get(
    "/payment/get-seller-payment-details/:sellerId",
    authMiddleware,
    paymentController.get_seller_payment_details
);

router.post(
    "/payment/seller-send-request-withdraw",
    authMiddleware,
    paymentController.seller_send_request_withdraw
);

router.get(
    "/payment/get-request-payment",
    authMiddleware,
    paymentController.get_request_payment
);

router.post(
    "/payment/confirm-payment-request",
    authMiddleware,
    paymentController.confirm_payment_request
);

module.exports = router;
