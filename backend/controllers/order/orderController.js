const moment = require("moment");
const { responseReturn } = require("../../utiles/response");
const customerOder = require("../../models/customerOrder");
const authOrder = require("../../models/authOrder");
const cartModel = require("../../models/cardModel");
const stripe = require("stripe")(
    "sk_test_51PkqJ401TMMiDul2ErJLiarIUYhuzOhoGbICifjQzaqWeRKFz3ajU3ZH3QbP6QCkXiRMgEIldbo6MbL8kJMM9aJa00psBK8Hzl"
);
const sellerWallet = require("../../models/sellerWallet");
const myShopWallet = require("../../models/myShopWallet");

const {
    mongo: { ObjectId },
} = require("mongoose");

class orderController {
    paymentCheck = async (id) => {
        try {
            const order = await customerOder.findById(id);
            if (order.payment_status === "unpaid") {
                await customerOder.findByIdAndUpdate(id, {
                    delivery_status: "cancelled",
                });
                await authOrder.updateMany(
                    {
                        orderId: id,
                    },
                    {
                        delivery_status: "cancelled",
                    }
                );
            }
            return true;
        } catch (error) {
            console.log(error);
        }
    };

    place_order = async (req, res) => {
        const { price, products, shipping_fee, shippingInfo, userId } =
            req.body;

        //clg req.body để xem kết quả trả về trước khi thực hiện read
        // console.log(req.body);

        let authorOrderData = [];

        let cardId = [];

        const tempDate = moment(Date.now()).format("LLL");

        let customerOrderProduct = [];

        for (let i = 0; i < products.length; i++) {
            const pro = products[i].products;

            for (let j = 0; j < pro.length; j++) {
                const tempCusPro = pro[j].productInfo;
                tempCusPro.quantity = pro[j].quantity;
                customerOrderProduct.push(tempCusPro);
                if (pro[j]._id) {
                    cardId.push(pro[j]._id);
                }
            }
        }

        try {
            const order = await customerOder.create({
                customerId: userId,
                shippingInfo,
                products: customerOrderProduct,
                price: price + shipping_fee,
                payment_status: "unpaid",
                delivery_status: "pending",
                date: tempDate,
            });

            //luu don hang theo seller
            for (let i = 0; i < products.length; i++) {
                const pro = products[i].products;
                const pri = products[i].price;
                const sellerId = products[i].sellerId;

                let storePro = [];
                for (let j = 0; j < pro.length; j++) {
                    const tempPro = pro[j].productInfo;
                    tempPro.quantity = pro[j].quantity;
                    storePro.push(tempPro);
                }

                authorOrderData.push({
                    orderId: order.id,
                    sellerId,
                    products: storePro,
                    price: pri,
                    payment_status: "unpaid",
                    delivery_status: "pending",
                    // shippingInfo,
                    date: tempDate,
                });
            }
            await authOrder.insertMany(authorOrderData);

            //order finish -> delete cart
            for (let k = 0; k < cardId.length; k++) {
                await cartModel.findByIdAndDelete(cardId[k]);

                // const cart = await cartModel.findById(cardId[k]);
                // if (cart && cart.userId === userId) {
                //     await cartModel.findByIdAndDelete(cardId[k]);
                // }
            }

            setTimeout(() => {
                this.paymentCheck(order.id);
            }, 50000);

            responseReturn(res, 200, {
                message: "Order Successfully",
                orderId: order.id,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    get_data_dashboard = async (req, res) => {
        const { userId } = req.params;

        // console.log(userId);
        try {
            const recentOrders = await customerOder
                .find({ customerId: new ObjectId(userId) })
                .limit(5);

            const pendingOrder = await customerOder
                .find({
                    customerId: new ObjectId(userId),
                    delivery_status: "pending",
                })
                .countDocuments();

            const cancelledOrder = await customerOder
                .find({
                    customerId: new ObjectId(userId),
                    delivery_status: "cancelled",
                })
                .countDocuments();

            const totalOrder = await customerOder
                .find({
                    customerId: new ObjectId(userId),
                })
                .countDocuments();

            responseReturn(res, 200, {
                recentOrders,
                pendingOrder,
                totalOrder,
                cancelledOrder,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    get_orders = async (req, res) => {
        const { customerId, status } = req.params;

        try {
            let orders = [];
            if (status !== "all") {
                orders = await customerOder.find({
                    customerId: new ObjectId(customerId),
                    delivery_status: status,
                });
            } else {
                orders = await customerOder.find({
                    customerId: new ObjectId(customerId),
                });
            }

            responseReturn(res, 200, {
                orders,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    get_order_detail = async (req, res) => {
        const { orderId } = req.params;

        try {
            const order = await customerOder.findById(orderId);
            responseReturn(res, 200, {
                order,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    get_admin_orders = async (req, res) => {
        const { page, parPage, searchValue } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
            } else {
                const orders = await customerOder
                    .aggregate([
                        {
                            $lookup: {
                                from: "authororders",
                                localField: "_id",
                                foreignField: "orderId",
                                as: "suborder",
                            },
                        },
                    ])
                    .skip(skipPage)
                    .sort({ createdAt: -1 });

                const totalOrder = await customerOder.aggregate([
                    {
                        $lookup: {
                            from: "authororders",
                            localField: "_id",
                            foreignField: "orderId",
                            as: "suborder",
                        },
                    },
                ]);

                responseReturn(res, 200, {
                    orders,
                    totalOrder: totalOrder.length,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    get_admin_order = async (req, res) => {
        const { orderId } = req.params;

        try {
            const order = await customerOder.aggregate([
                {
                    $match: { _id: new ObjectId(orderId) },
                },
                {
                    $lookup: {
                        from: "authororders",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "suborder",
                    },
                },
            ]);
            responseReturn(res, 200, { order: order[0] });
        } catch (error) {
            console.log(error);
        }
    };

    order_update_status = async (req, res) => {
        const { orderId } = req.params;
        const { status } = req.body;

        try {
            await customerOder.findByIdAndUpdate(orderId, {
                delivery_status: status,
            });
            responseReturn(res, 200, {
                message: "order Status change success",
            });
        } catch (error) {
            console.log("get admin status error" + error.message);
            responseReturn(res, 500, { message: "internal server error" });
        }
    };

    get_seller_orders = async (req, res) => {
        const { sellerId } = req.params;

        const { parPage, page, searchValue } = req.query;

        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
            } else {
                const orders = await authOrder
                    .find({
                        sellerId,
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createdAt: -1 });
                const totalOrder = await authOrder
                    .find({
                        sellerId,
                    })
                    .countDocuments();
                responseReturn(res, 200, { orders, totalOrder });
            }
        } catch (error) {
            console.log("get seller Order error" + error.message);
            responseReturn(res, 500, { message: "internal server error" });
        }
    };

    get_seller_order = async (req, res) => {
        const { orderId } = req.params;

        try {
            const orderDetails = await authOrder.aggregate([
                {
                    $match: { _id: new ObjectId(orderId) },
                },
                {
                    $lookup: {
                        from: "customerorders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "customerOrderDetails",
                    },
                },
                {
                    $unwind: "$customerOrderDetails",
                },
                {
                    $project: {
                        _id: 1,
                        sellerId: 1,
                        products: 1,
                        price: 1,
                        payment_status: 1,
                        delivery_status: 1,
                        shippingInfo: "$customerOrderDetails.shippingInfo",
                        date: 1,
                    },
                },
            ]);

            if (!orderDetails.length) {
                return res.status(404).json({ message: "Order not found" });
            }

            responseReturn(res, 200, { order: orderDetails[0] });
        } catch (error) {
            console.log("get seller details error: " + error.message);
            res.status(500).json({ message: "Server error" });
        }
    };

    seller_order_status_update = async (req, res) => {
        const { orderId } = req.params;
        const { status } = req.body;
        try {
            await authOrder.findByIdAndUpdate(orderId, {
                delivery_status: status,
            });
            responseReturn(res, 200, {
                message: "order status updated successfully",
            });
        } catch (error) {
            console.log("get seller Order error" + error.message);
            responseReturn(res, 500, { message: "internal server error" });
        }
    };

    create_payment = async (req, res) => {
        const { price } = req.body;

        try {
            const payment = await stripe.paymentIntents.create({
                amount: price,
                currency: "vnd",
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            responseReturn(res, 200, { clientSecret: payment.client_secret });
        } catch (error) {
            console.log(error.message);
        }
    };

    order_confirm = async (req, res) => {
        const { orderId } = req.params;

        try {
            await customerOder.findByIdAndUpdate(orderId, {
                payment_status: "paid",
            });

            await authOrder.updateMany(
                {
                    orderId: new ObjectId(orderId),
                },
                {
                    payment_status: "paid",
                    delivery_status: "pending",
                }
            );

            const customerOrder = await customerOder.findById(orderId);
            const auOrder = await authOrder.find({
                orderId: new ObjectId(orderId),
            });

            const time = moment(Date.now()).format("l");
            const splitTime = time.split("/");

            await myShopWallet.create({
                amount: customerOrder.price,
                month: splitTime[0],
                year: splitTime[2],
            });

            for (let i = 0; i < auOrder.length; i++) {
                await sellerWallet.create({
                    sellerId: auOrder[i].sellerId.toString(),
                    amount: auOrder[i].price,
                    month: splitTime[0],
                    year: splitTime[2],
                });
            }

            responseReturn(res, 200, { message: "success" });
        } catch (error) {
            console.log(error.message);
        }
    };
}

module.exports = new orderController();
