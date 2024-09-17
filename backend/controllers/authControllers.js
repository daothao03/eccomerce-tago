const adminModel = require("../models/adminModel");
const sellerModel = require("../models/sellerModel");
const { responseReturn } = require("../utiles/response");
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { createToken } = require("../utiles/tokenCreate");
const sellerCustomerModel = require("../models/chat/sellerCustomerModel");

class authControllers {
    admin_login = async (req, res) => {
        // console.log(req.body);
        const { email, password } = req.body;
        try {
            const admin = await adminModel
                .findOne({ email })
                .select("+password");
            if (admin) {
                const match = await bcrypt.compare(password, admin.password);
                // console.log(match);

                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role,
                    });
                    res.cookie("accessToken", token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });
                    responseReturn(res, 200, {
                        token,
                        message: "Login Success",
                    });
                } else {
                    responseReturn(res, 404, { error: "Password Wrong" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    seller_register = async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const getUser = await sellerModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: "Email Already Exit" });
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: "normally",
                    shopInfo: {},
                });

                await sellerCustomerModel.create({
                    myId: seller.id,
                });

                const token = await createToken({
                    id: seller.id,
                    role: seller.role,
                });

                res.cookie("accessToken", token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                });

                responseReturn(res, 201, {
                    token,
                    message: "Register Success",
                });
            }
        } catch (error) {
            responseReturn(res, 500, { error: "Internal Server Error" });
        }
    };

    getUser = async (req, res) => {
        const { id, role } = req;
        try {
            if (role === "admin") {
                const user = await adminModel.findById(id);
                responseReturn(res, 200, { userInfo: user });
            } else {
                const seller = await sellerModel.findById(id);
                responseReturn(res, 200, { userInfo: seller });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    seller_login = async (req, res) => {
        // console.log(req.body);
        const { email, password } = req.body;
        try {
            const seller = await sellerModel
                .findOne({ email })
                .select("+password");
            if (seller) {
                const match = await bcrypt.compare(password, seller.password);
                // console.log(match);

                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role,
                    });
                    res.cookie("accessToken", token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });
                    responseReturn(res, 200, {
                        token,
                        message: "Login Success",
                    });
                } else {
                    responseReturn(res, 404, { error: "Password Wrong" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    profile_image_upload = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });

        form.parse(req, async (err, _, files) => {
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
                    {
                        folder: "profile",
                    }
                );

                if (result) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: result.url,
                    });

                    const userInfo = await sellerModel.findById(id);

                    responseReturn(res, 200, {
                        userInfo,
                        message: "Upload Image Profile Successfully",
                    });
                }
            } catch (error) {
                responseReturn(res, 404, { error: error.message });
            }
        });
    };

    add_info = async (req, res) => {
        const { id } = req;
        const { division, district, shopName, sub_district } = req.body;

        try {
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    division,
                    district,
                    shopName,
                    sub_district,
                },
            });

            const userInfo = await sellerModel.findById(id);
            responseReturn(res, 200, {
                userInfo,
                message: "Added Info Profile Successfully",
            });
        } catch (error) {
            responseReturn(res, 404, { error: error.message });
        }
    };

    logout = async (req, res) => {
        try {
            res.cookie("accessToken", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });
            responseReturn(res, 200, { message: "logout Success" });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new authControllers();
