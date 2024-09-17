const cloudinary = require("cloudinary").v2;
const slugify = require("slugify");
const productModel = require("../../models/productModel");
const sellerModel = require("../../models/sellerModel");
const formidable = require("formidable");
const { responseReturn } = require("../../utiles/response");

class productController {
    //POST product
    add_product = async (req, res) => {
        // console.log("product ok");
        const { id } = req;

        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            const {
                name,
                category,
                short_description,
                long_description,
                discount,
                price,
                brand,
                stock,
                shopName,
            } = fields;

            let { images } = files;

            // const slug = slugify(name);

            // Nếu chỉ có một hình ảnh, formidable sẽ không tạo một mảng
            if (!Array.isArray(images)) {
                images = [images];
            }

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true,
            });

            try {
                let allImageUrl = [];
                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(
                        images[i].filepath,
                        {
                            folder: "products",
                        }
                    );
                    allImageUrl = [...allImageUrl, result.url];
                    console.log(`Image ${i + 1} uploaded`);
                }

                // console.log("Start creating product");

                const seller = await sellerModel.findById(id);
                if (!seller) {
                    return responseReturn(res, 404, {
                        error: "Seller not found",
                    });
                }

                // Nếu seller có shopName, sử dụng nó, nếu không, sử dụng shopName từ fields
                const sellerShopName = seller.shopInfo.shopName || shopName;

                await productModel.create({
                    sellerId: id,
                    name,
                    slug: slugify(name),
                    shopName: sellerShopName,
                    category: category.trim(),
                    short_description: short_description.trim(),
                    long_description: long_description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images: allImageUrl,
                    brand: brand.trim(),
                });
                responseReturn(res, 201, {
                    message: "Product Added Successfully",
                });
            } catch (error) {
                responseReturn(res, 500, {
                    error: error.message,
                });
            }

            // console.log(fields);
        });
    };

    //GET :all
    get_products = async (req, res) => {
        // console.log(req.query);
        // console.log(req.id);

        const { page, searchValue, parPage } = req.query;
        const { id } = req;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
                const products = await productModel
                    .find({
                        $text: { $search: searchValue },
                        sellerId: id,
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createdAt: -1 });
                const totalProduct = await productModel
                    .find({
                        $text: { $search: searchValue },
                        sellerId: id,
                    })
                    .countDocuments();
                responseReturn(res, 200, { products, totalProduct });
            } else {
                const products = await productModel
                    .find({ sellerId: id })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createdAt: -1 });
                const totalProduct = await productModel
                    .find({ sellerId: id })
                    .countDocuments();
                responseReturn(res, 200, { products, totalProduct });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    //GET :id
    get_product = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product });
        } catch (error) {
            console.log(error.message);
        }
    };

    //PUT :id
    update_product = async (req, res) => {
        // console.log("update ok");
        const {
            name,
            short_description,
            long_description,
            discount,
            price,
            brand,
            stock,
            productId,
        } = req.body;

        try {
            await productModel.findByIdAndUpdate(productId, {
                name,
                short_description,
                long_description,
                discount,
                price,
                brand,
                stock,
                productId,
                slug: slugify(name),
            });

            //Lấy lại info
            const product = await productModel.findById(productId);

            responseReturn(res, 200, {
                product,
                message: "Product Updated Successfully",
            });
        } catch (error) {
            responseReturn(res, 500, {
                error: error.message,
            });
        }
    };

    //UPDATE image

    // update_image_product = async (req, res) => {
    //     const form = new formidable.IncomingForm({ multiples: true });

    //     form.parse(req, async (err, fields, files) => {
    //         if (err) {
    //             return responseReturn(res, 400, { error: err.message });
    //         }

    //         const { oldImage, productId } = fields;
    //         const { newImage } = files;

    //         // Kiểm tra và ghi lại đối tượng newImage
    //         console.log("fields:", fields);
    //         console.log("files:", files);

    //         if (!newImage) {
    //             return responseReturn(res, 400, {
    //                 error: "New image not provided",
    //             });
    //         }

    //         if (!newImage.filepath) {
    //             return responseReturn(res, 400, {
    //                 error: "New image does not have a filepath property",
    //             });
    //         }

    //         // Ghi lại filepath của newImage
    //         console.log("Filepath of newImage:", newImage.filepath);

    //         try {
    //             cloudinary.config({
    //                 cloud_name: process.env.cloud_name,
    //                 api_key: process.env.api_key,
    //                 api_secret: process.env.api_secret,
    //                 secure: true,
    //             });

    //             const result = await cloudinary.uploader.upload(
    //                 newImage.filepath,
    //                 {
    //                     folder: "products",
    //                 }
    //             );

    //             if (result) {
    //                 let { images } = await productModel.findById(productId);
    //                 const index = images.findIndex((img) => img === oldImage);
    //                 images[index] = result.url;

    //                 await productModel.findByIdAndUpdate(productId, { images });

    //                 const product = await productModel.findById(productId);

    //                 responseReturn(res, 200, {
    //                     product,
    //                     message: "Product Image Updated Successfully",
    //                 });
    //             } else {
    //                 responseReturn(res, 404, {
    //                     error: "Product Image Upload Failed",
    //                 });
    //             }
    //         } catch (error) {
    //             responseReturn(res, 404, { error: error.message });
    //         }
    //     });
    // };

    update_image_product = async (req, res) => {
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 400, { error: err.message });
            }

            const { oldImage, productId } = fields;
            const { newImage } = files;

            if (!newImage) {
                return responseReturn(res, 400, {
                    error: "New image not provided",
                });
            }

            if (!newImage.filepath) {
                return responseReturn(res, 400, {
                    error: "New image does not have a filepath property",
                });
            }

            try {
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true,
                });

                const result = await cloudinary.uploader.upload(
                    newImage.filepath,
                    {
                        folder: "products",
                    }
                );

                if (result) {
                    let { images } = await productModel.findById(productId);

                    if (oldImage) {
                        const index = images.findIndex(
                            (img) => img === oldImage
                        );
                        images[index] = result.url;
                    } else {
                        images.push(result.url);
                    }

                    await productModel.findByIdAndUpdate(productId, { images });

                    const product = await productModel.findById(productId);

                    responseReturn(res, 200, {
                        product,
                        message: "Product Image Updated Successfully",
                    });
                } else {
                    responseReturn(res, 404, {
                        error: "Product Image Upload Failed",
                    });
                }
            } catch (error) {
                responseReturn(res, 404, { error: error.message });
            }
        });
    };
}

module.exports = new productController();
