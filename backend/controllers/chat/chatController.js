const customerModel = require("../../models/customerModel");
const sellerModel = require("../../models/sellerModel");
const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const sellerCustomerMessageModel = require("../../models/chat/sellerCustomerMessage");
const sellerAdminMessageModel = require("../../models/chat/adminSellerMessage");
const { responseReturn } = require("../../utiles/response");
const adminSellerMessage = require("../../models/chat/adminSellerMessage");

class chatController {
    add_customer_friend = async (req, res) => {
        const { sellerId, userId } = req.body;
        try {
            if (sellerId !== "") {
                const seller = await sellerModel.findById(sellerId);
                const user = await customerModel.findById(userId);
                const checkSeller = await sellerCustomerModel.findOne({
                    $and: [
                        {
                            myId: {
                                $eq: userId,
                            },
                        },
                        {
                            myFriends: {
                                $elemMatch: {
                                    fdId: sellerId,
                                },
                            },
                        },
                    ],
                });
                if (!checkSeller) {
                    await sellerCustomerModel.updateOne(
                        {
                            myId: userId,
                        },
                        {
                            $push: {
                                myFriends: {
                                    fdId: sellerId,
                                    name: seller.shopInfo?.shopName,
                                    image: seller.image,
                                },
                            },
                        }
                    );
                }
                const checkCustomer = await sellerCustomerModel.findOne({
                    $and: [
                        {
                            myId: {
                                $eq: sellerId,
                            },
                        },
                        {
                            myFriends: {
                                $elemMatch: {
                                    fdId: userId,
                                },
                            },
                        },
                    ],
                });
                if (!checkCustomer) {
                    await sellerCustomerModel.updateOne(
                        {
                            myId: sellerId,
                        },
                        {
                            $push: {
                                myFriends: {
                                    fdId: userId,
                                    name: user.name,
                                    image: "",
                                },
                            },
                        }
                    );
                }
                const messages = await sellerCustomerMessageModel.find({
                    $or: [
                        {
                            $and: [
                                {
                                    receiverId: { $eq: sellerId },
                                },
                                {
                                    senderId: {
                                        $eq: userId,
                                    },
                                },
                            ],
                        },
                        {
                            $and: [
                                {
                                    receiverId: { $eq: userId },
                                },
                                {
                                    senderId: {
                                        $eq: sellerId,
                                    },
                                },
                            ],
                        },
                    ],
                });
                const MyFriends = await sellerCustomerModel.findOne({
                    myId: userId,
                });
                const currentFd = MyFriends.myFriends.find(
                    (s) => s.fdId === sellerId
                );
                responseReturn(res, 200, {
                    MyFriends: MyFriends.myFriends,
                    currentFd,
                    messages,
                });
            } else {
                const MyFriends = await sellerCustomerModel.findOne({
                    myId: userId,
                });
                responseReturn(res, 200, {
                    MyFriends: MyFriends.myFriends,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Giả sử myFriends là một mảng các số và index bắt đầu từ 3:
    // let myFriends = [1, 2, 3, 4];
    // let index = 3;

    // Bước 1: index = 3
    // temp = myFriends[3] => temp = 4
    // myFriends[3] = myFriends[2] => myFriends = [1, 2, 3, 3]
    // myFriends[2] = temp => myFriends = [1, 2, 4, 3]
    // index-- => index = 2

    // Bước 2: index = 2
    // temp = myFriends[2] => temp = 4
    // myFriends[2] = myFriends[1] => myFriends = [1, 2, 2, 3]
    // myFriends[1] = temp => myFriends = [1, 4, 2, 3]
    // index-- => index = 1

    // Bước 3: index = 1
    // temp = myFriends[1] => temp = 4
    // myFriends[1] = myFriends[0] => myFriends = [1, 1, 2, 3]
    // myFriends[0] = temp => myFriends = [4, 1, 2, 3]
    // index-- => index = 0
    // Kết thúc vòng lặp, mảng myFriends sẽ là [4, 1, 2, 3].
    customer_send_message = async (req, res) => {
        const { userId, text, sellerId, name } = req.body;
        try {
            const message = await sellerCustomerMessageModel.create({
                senderId: userId,
                senderName: name,
                receiverId: sellerId,
                message: text,
            });
            const data = await sellerCustomerModel.findOne({ myId: userId });
            let myFriends = data.myFriends;
            let index = myFriends.findIndex((f) => f.fdId === sellerId);
            while (index > 0) {
                let temp = myFriends[index];
                myFriends[index] = myFriends[index - 1];
                myFriends[index - 1] = temp;
                index--;
            }
            await sellerCustomerModel.updateOne(
                {
                    myId: userId,
                },
                {
                    myFriends,
                }
            );
            const data1 = await sellerCustomerModel.findOne({ myId: sellerId });
            let myFriends1 = data1.myFriends;
            let index1 = myFriends1.findIndex((f) => f.fdId === userId);
            while (index1 > 0) {
                let temp1 = myFriends1[index1];
                myFriends1[index1] = myFriends[index1 - 1];
                myFriends1[index1 - 1] = temp1;
                index1--;
            }
            await sellerCustomerModel.updateOne(
                {
                    myId: sellerId,
                },
                {
                    myFriends1,
                }
            );
            responseReturn(res, 201, { message });
        } catch (error) {
            console.log(error);
        }
    };

    get_customers = async (req, res) => {
        const { sellerId } = req.params;

        try {
            const data = await sellerCustomerModel.findOne({ myId: sellerId });
            responseReturn(res, 200, {
                customers: data.myFriends,
            });
        } catch (error) {
            console.log(error);
        }
    };

    get_message_customers = async (req, res) => {
        const { customerId } = req.params;
        const { id } = req;

        try {
            const messages = await sellerCustomerMessageModel.find({
                $or: [
                    {
                        $and: [
                            {
                                senderId: {
                                    $eq: customerId,
                                },
                            },
                            {
                                receiverId: {
                                    $eq: id,
                                },
                            },
                        ],
                    },
                    {
                        $and: [
                            {
                                senderId: {
                                    $eq: id,
                                },
                            },
                            {
                                receiverId: {
                                    $eq: customerId,
                                },
                            },
                        ],
                    },
                ],
            });

            const currentCustomer = await customerModel.findById(customerId);
            responseReturn(res, 200, {
                messages,
                currentCustomer,
            });
        } catch (error) {
            console.log(error);
        }
    };

    seller_send_message_to_customer = async (req, res) => {
        const { senderId, receiverId, text, name } = req.body;
        try {
            const message = await sellerCustomerMessageModel.create({
                senderId: senderId,
                senderName: name,
                receiverId: receiverId,
                message: text,
            });

            const data = await sellerCustomerModel.findOne({ myId: senderId });
            let myFriends = data.myFriends;
            let index = myFriends.findIndex((f) => f.fdId === receiverId);
            while (index > 0) {
                let temp = myFriends[index];
                myFriends[index] = myFriends[index - 1];
                myFriends[index - 1] = temp;
                index--;
            }
            await sellerCustomerModel.updateOne(
                {
                    myId: senderId,
                },
                {
                    myFriends,
                }
            );

            const data1 = await sellerCustomerModel.findOne({
                myId: receiverId,
            });
            let myFriends1 = data1.myFriends;
            let index1 = myFriends1.findIndex((f) => f.fdId === senderId);
            while (index1 > 0) {
                let temp1 = myFriends1[index1];
                myFriends1[index1] = myFriends[index1 - 1];
                myFriends1[index1 - 1] = temp1;
                index1--;
            }
            await sellerCustomerModel.updateOne(
                {
                    myId: receiverId,
                },
                {
                    myFriends1,
                }
            );

            responseReturn(res, 201, { message });
        } catch (error) {
            console.log(error);
        }
    };

    get_sellers = async (req, res) => {
        try {
            const sellers = await sellerModel.find({});
            responseReturn(res, 200, { sellers });
        } catch (error) {
            console.log(error);
        }
    };

    send_message_seller_admin = async (req, res) => {
        const { senderId, message, receiverId, senderName } = req.body;

        try {
            const messageData = await sellerAdminMessageModel.create({
                senderId,
                message,
                receiverId,
                senderName,
            });

            responseReturn(res, 200, { message: messageData });
        } catch (error) {}
    };

    get_admin_messages = async (req, res) => {
        const { receiverId } = req.params;
        const id = "";

        try {
            const messages = await sellerAdminMessageModel.find({
                $or: [
                    {
                        $and: [
                            {
                                senderId: {
                                    $eq: receiverId,
                                },
                            },
                            {
                                receiverId: {
                                    $eq: id,
                                },
                            },
                        ],
                    },
                    {
                        $and: [
                            {
                                senderId: {
                                    $eq: id,
                                },
                            },
                            {
                                receiverId: {
                                    $eq: receiverId,
                                },
                            },
                        ],
                    },
                ],
            });

            let currentSeller = {};
            if (receiverId) {
                currentSeller = await sellerModel.findById(receiverId);
            }
            responseReturn(res, 200, {
                messages,
                currentSeller,
            });
        } catch (error) {
            console.log(error);
        }
    };

    get_seller_messages = async (req, res) => {
        const receiverId = "";
        const { id } = req;

        try {
            const messages = await adminSellerMessage.find({
                $or: [
                    {
                        $and: [
                            {
                                receiverId: { $eq: receiverId },
                            },
                            {
                                senderId: {
                                    $eq: id,
                                },
                            },
                        ],
                    },
                    {
                        $and: [
                            {
                                receiverId: { $eq: id },
                            },
                            {
                                senderId: {
                                    $eq: receiverId,
                                },
                            },
                        ],
                    },
                ],
            });

            responseReturn(res, 200, {
                messages,
            });
        } catch (error) {
            console.log(error);
        }
    };
}
module.exports = new chatController();
