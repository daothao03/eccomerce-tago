const myShopWallet = require("../../models/myShopWallet");
const sellerWallet = require("../../models/sellerWallet");
const product = require("../../models/productModel");
const seller = require("../../models/sellerModel");
const customerOrder = require("../../models/customerOrder");
const authOrder = require("../../models/authOrder");
const adminSellerMessage = require("../../models/chat/adminSellerMessage");
const sellerCustomerMessage = require("../../models/chat/sellerCustomerMessage");
const bannerModel = require("../../models/bannerModel");
const { responseReturn } = require("../../utiles/response");
const {
    mongo: { ObjectId },
} = require("mongoose");

const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

class dashboardController {
    get_admin_dashboard_data = async (req, res) => {
        const { id } = req;

        try {
            const totalSale = await myShopWallet.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: "$amount",
                        },
                    },
                },
            ]);

            const totalProduct = await product.find({}).countDocuments();
            const totalSeller = await seller.find({}).countDocuments();
            const totalOrder = await customerOrder.find({}).countDocuments();
            const recentMessages = await adminSellerMessage.find({}).limit(3);
            const recentOrders = await customerOrder.find({}).limit(5);

            responseReturn(res, 200, {
                totalProduct,
                totalOrder,
                totalSeller,
                recentMessages,
                recentOrders,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            });
        } catch (error) {
            console.log(error);
        }
    };

    get_seller_dashboard_data = async (req, res) => {
        const { id } = req;

        try {
            const monthlyRevenue = await sellerWallet.aggregate([
                {
                    $match: {
                        sellerId: {
                            $eq: id,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            month: "$month",
                            year: "$year",
                        }, // Nhóm theo tháng và năm
                        totalRevenue: { $sum: "$amount" },
                    },
                },
                {
                    $match: { "_id.year": new Date().getFullYear() }, // Lọc chỉ lấy dữ liệu trong năm hiện tại
                },
                {
                    $sort: { "_id.month": 1 },
                },
            ]);

            console.log(monthlyRevenue);

            // Khoi tao mảng chứa doanh thu và tổng đơn hàng cho từng tháng
            const monthlyData = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                totalRevenue: 0,
                totalOrders: 0,
            }));

            // Cập nhật doanh thu vào đúng tháng trong mảng
            monthlyRevenue.forEach((item) => {
                monthlyData[item._id.month - 1].totalRevenue =
                    item.totalRevenue;
            });

            // Tính tổng số lượng đơn hàng theo tháng
            const monthlyOrders = await authOrder.aggregate([
                {
                    $match: { sellerId: new ObjectId(id) },
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" },
                        }, // Nhóm theo tháng và năm
                        totalOrders: { $sum: 1 }, // Đếm số lượng đơn hàng trong tháng
                    },
                },
                {
                    $match: { "_id.year": new Date().getFullYear() }, // Lọc chỉ lấy dữ liệu trong năm hiện tại
                },
                {
                    $sort: { "_id.month": 1 }, // Sắp xếp theo thứ tự tháng
                },
            ]);

            // Cập nhật tổng số lượng đơn hàng vào đúng tháng trong mảng
            monthlyOrders.forEach((item) => {
                monthlyData[item._id.month - 1].totalOrders = item.totalOrders;
            });

            const totalSale = await sellerWallet.aggregate([
                {
                    $match: {
                        sellerId: {
                            $eq: id,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" },
                    },
                },
            ]);

            const totalProduct = await product
                .find({
                    sellerId: new ObjectId(id),
                })
                .countDocuments();

            const totalOrder = await authOrder
                .find({
                    sellerId: new ObjectId(id),
                })
                .countDocuments();

            const totalPendingOrder = await authOrder
                .find({
                    $and: [
                        {
                            sellerId: {
                                $eq: new ObjectId(id),
                            },
                        },
                        {
                            delivery_status: {
                                $eq: "pending",
                            },
                        },
                    ],
                })
                .countDocuments();
            const messages = await sellerCustomerMessage
                .find({
                    $or: [
                        {
                            senderId: {
                                $eq: id,
                            },
                        },
                        {
                            receiverId: {
                                $eq: id,
                            },
                        },
                    ],
                })
                .limit(3);

            const recentOrders = await authOrder
                .find({
                    sellerId: new ObjectId(id),
                })
                .limit(5);

            responseReturn(res, 200, {
                totalProduct,
                totalOrder,
                totalPendingOrder,
                messages,
                recentOrders,
                monthlyData,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            });
        } catch (error) {
            console.log(error);
        }
    };

    add_banner = async (req, res) => {
        const form = formidable();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                responseReturn(res, 404, { error: "Something went wrong" });
            } else {
                const { image } = files;

                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true,
                });

                try {
                    const result = await cloudinary.uploader.upload(
                        image.filepath,
                        { folder: "banner" }
                    );
                    if (result) {
                        const banner = await bannerModel.create({
                            image: result.url,
                        });
                        responseReturn(res, 201, {
                            banner,
                            message: "Banner Added Successfully",
                        });
                    } else {
                        responseReturn(res, 404, {
                            error: "Image Upload File",
                        });
                    }
                } catch (error) {
                    console.error(
                        "Error during upload or category creation:",
                        error
                    );
                    responseReturn(res, 500, {
                        error: "Internal Server Error",
                    });
                }
            }
        });
    };

    get_banners = async (req, res) => {
        try {
            const banners = await bannerModel.find({}).sort({ createdAt: -1 });

            responseReturn(res, 200, { banners });
        } catch (error) {
            console.log(error.mess);
        }
    };

    banner_status_update = async (req, res) => {
        const { bannerId } = req.params;
        const { status } = req.body;

        try {
            await bannerModel.findByIdAndUpdate(bannerId, {
                status: status,
            });
            responseReturn(res, 200, {
                message: "banner status updated successfully",
            });
        } catch (error) {
            console.log("get seller Order error" + error.message);
            responseReturn(res, 500, { message: "internal server error" });
        }
    };

    delete_banner = async (req, res) => {
        const { bannerId } = req.params;

        try {
            await bannerModel.findByIdAndDelete(bannerId);
            responseReturn(res, 200, {
                message: "banner delete successfully",
            });
        } catch (error) {
            console.log("get seller Order error" + error.message);
            responseReturn(res, 500, { message: "internal server error" });
        }
    };
}

module.exports = new dashboardController();
