const stripeModel = require("../../models/stripeModel");
const sellerModel = require("../../models/sellerModel");

const sellerWallet = require("../../models/sellerWallet");
const withdrawRequest = require("../../models/withdrawRequest");

const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
    "sk_test_51PkqJ401TMMiDul2ErJLiarIUYhuzOhoGbICifjQzaqWeRKFz3ajU3ZH3QbP6QCkXiRMgEIldbo6MbL8kJMM9aJa00psBK8Hzl"
);
const { responseReturn } = require("../../utiles/response");
const {
    mongo: { ObjectId },
} = require("mongoose");

class paymentControllers {
    create_momo_connect_account = async (req, res) => {
        const { id } = req;
        const uid = uuidv4();

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id });

            if (stripeInfo) {
                await stripeModel.deleteOne({ sellerId: id });
                const account = await stripe.accounts.create({
                    type: "express",
                });

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: "http://localhost:3001/refresh",
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: "account_onboarding",
                });
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid,
                });
                responseReturn(res, 201, { url: accountLink.url });
            } else {
                const account = await stripe.accounts.create({
                    type: "express",
                });

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: "http://localhost:3001/refresh",
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: "account_onboarding",
                });
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid,
                });
                responseReturn(res, 201, { url: accountLink.url });
            }
        } catch (error) {
            console.log("strpe connect account errror" + error.message);
        }
    };

    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params;
        const { id } = req;

        try {
            const userStripeInfo = await stripeModel.findOne({
                code: activeCode,
            });

            if (userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id, { payment: "active" });
                responseReturn(res, 200, { message: "payment active" });
            } else {
                responseReturn(res, 404, { message: "payment active fails" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "Internal server error" });
        }
    };

    sum_amount = (data) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i].amount;
        }
        return sum;
    };

    get_seller_payment_details = async (req, res) => {
        const { sellerId } = req.params;

        try {
            const payments = await sellerWallet.find({ sellerId });

            const pendingWithdraws = await withdrawRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId,
                        },
                    },
                    {
                        status: {
                            $eq: "pending",
                        },
                    },
                ],
            });

            const successWithdraws = await withdrawRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId,
                        },
                    },
                    {
                        status: {
                            $eq: "success",
                        },
                    },
                ],
            });
            const withdrawAmount = this.sum_amount(successWithdraws);
            const pendingAmount = this.sum_amount(pendingWithdraws);
            const totalAmount = this.sum_amount(payments);

            let availableAmount = 0;
            if (totalAmount > 0) {
                availableAmount =
                    totalAmount - (pendingAmount + withdrawAmount);
            }

            responseReturn(res, 200, {
                pendingWithdraws,
                successWithdraws,
                totalAmount,
                withdrawAmount,
                pendingAmount,
                availableAmount,
            });
        } catch (error) {
            console.error();
        }
    };

    seller_send_request_withdraw = async (req, res) => {
        const { sellerId, amount } = req.body;

        try {
            const withdraw = await withdrawRequest.create({
                sellerId,
                amount: parseInt(amount),
            });
            responseReturn(res, 200, {
                withdraw,
                message: "Withdrawal Request Send",
            });
        } catch (error) {
            responseReturn(res, 500, { message: "Internal Server Error" });
        }
    };

    get_request_payment = async (req, res) => {
        try {
            const pendingWithdrawsRequest = await withdrawRequest.find({
                status: "pending",
            });
            responseReturn(res, 200, { pendingWithdrawsRequest });
        } catch (error) {
            console.error();
        }
    };

    confirm_payment_request = async (req, res) => {
        const { paymentId } = req.body;
        try {
            const payment = await withdrawRequest.findById(paymentId);
            const { stripeId } = await stripeModel.findOne({
                sellerId: new ObjectId(payment.sellerId),
            });

            const exchangeRate = 24000; // Tỷ giá hối đoái hiện tại, bạn cần cập nhật điều này.
            const amountInUSD = payment.amount / exchangeRate;
            const amountInCents = Math.round(amountInUSD * 100);

            await stripe.transfers.create({
                amount: amountInCents,
                currency: "usd",
                destination: stripeId,
            });

            await withdrawRequest.findByIdAndUpdate(paymentId, {
                status: "success",
            });

            responseReturn(res, 200, {
                payment,
                message: "Request Confirm Success",
            });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { message: "Internal Server Error" });
        }
    };
}

module.exports = new paymentControllers();
