const cardModel = require("../../models/cardModel");
const wishlistModel = require("../../models/wishlistModel");
const { responseReturn } = require("../../utiles/response");
const {
    mongo: { ObjectId },
} = require("mongoose");

class cardController {
    add_to_cart = async (req, res) => {
        const { userId, quantity, productId } = req.body;

        try {
            const product = await cardModel.findOne({
                productId: productId,
                userId: userId,
            });
            if (product) {
                responseReturn(res, 404, {
                    error: "Product Already Added To Card",
                });
            } else {
                const product = await cardModel.create({
                    userId,
                    productId,
                    quantity,
                });
                responseReturn(res, 201, {
                    message: "Added To Card Successfully",
                    product,
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    get_card_products = async (req, res) => {
        const co = 5; //admin: 5%
        const { userId } = req.params;

        try {
            // aggregation pipeline: qtr tong hop
            const card_products = await cardModel.aggregate([
                {
                    //filter
                    $match: {
                        //compare
                        userId: {
                            $eq: new ObjectId(userId),
                        },
                    },
                },
                {
                    // join
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "products",
                    },
                },
            ]);

            let buy_product_item = 0; // tong so quantity stock
            let calculatePrice = 0;
            let card_product_count = 0;

            // const outOfStockProduct = card_products.filter(
            //     (p) => p.products[0].stock < p.quantity // condition to filter
            // ); //outOfStockProduct => output: [],

            const outOfStockProduct = card_products.filter(
                (p) => p.products.length > 0 && p.products[0].stock < p.quantity
            );

            //slg sp het hang
            for (let i = 0; i < outOfStockProduct.length; i++) {
                card_product_count =
                    card_product_count + outOfStockProduct[i].quantity; // slg sp het hang
            }

            // slg sp con hang
            // const stockProduct = card_products.filter(
            //     (p) => p.products[0].stock >= p.quantity
            // );

            const stockProduct = card_products.filter(
                (p) =>
                    p.products.length > 0 && p.products[0].stock >= p.quantity
            );

            for (let i = 0; i < stockProduct.length; i++) {
                const { quantity } = stockProduct[i];

                // console.log(`Product ${i}: Quantity = ${quantity}`); // In ra số lượng của từng sản phẩm

                card_product_count = buy_product_item + quantity;
                // card_product_count += quantity;
                buy_product_item += quantity;

                const { price, discount } = stockProduct[i].products[0];
                if (discount !== 0) {
                    calculatePrice =
                        calculatePrice +
                        quantity *
                            (price - Math.floor((price * discount) / 100));
                } else {
                    calculatePrice = calculatePrice + quantity * price;
                }
            }

            let p = [];

            let unique = [
                ...new Set(
                    stockProduct.map((p) => p.products[0].sellerId.toString())
                ),
            ]; // Set: loai bo cac gia tri trung lap qua ===, lay ra sellerId

            for (let i = 0; i < unique.length; i++) {
                let price = 0;
                for (let j = 0; j < stockProduct.length; j++) {
                    const tempProduct = stockProduct[j].products[0];

                    if (unique[i] === tempProduct.sellerId.toString()) {
                        let pri = 0; // price sau khi ap dung discount
                        if (tempProduct.discount !== 0) {
                            pri =
                                tempProduct.price -
                                Math.floor(
                                    (tempProduct.price * tempProduct.discount) /
                                        100
                                );
                        } else {
                            pri = tempProduct.price;
                        }
                        // hoa hong nhan duoc cua admin khi moi don hang duoc van chuyen
                        pri = pri - Math.floor((pri * co) / 100); // giá sau khi trừ 5%

                        price = price + pri * stockProduct[j].quantity;

                        p[i] = {
                            sellerId: unique[i],
                            shopName: tempProduct.shopName,
                            price,
                            products: p[i]
                                ? [
                                      ...p[i].products,
                                      {
                                          _id: stockProduct[j]._id,
                                          quantity: stockProduct[j].quantity,
                                          productInfo: tempProduct,
                                      },
                                  ]
                                : [
                                      {
                                          _id: stockProduct[j]._id,
                                          quantity: stockProduct[j].quantity,
                                          productInfo: tempProduct,
                                      },
                                  ],
                        };
                    }
                }
            }

            responseReturn(res, 200, {
                card_products: p,
                price: calculatePrice,
                card_product_count,
                shipping_fee: 30000 * p.length,
                outOfStockProduct,
                buy_product_item,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    delete_card_products = async (req, res) => {
        const { cart_id } = req.params;

        try {
            await cardModel.findByIdAndDelete(cart_id);

            responseReturn(res, 200, {
                message: "Product Remove Successfully",
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    quantity_card_inc = async (req, res) => {
        const { cart_id } = req.params;

        try {
            const product = await cardModel.findById(cart_id);

            const { quantity } = product;

            await cardModel.findByIdAndUpdate(cart_id, {
                quantity: quantity + 1,
            });

            responseReturn(res, 200, {
                message: "Quantity Updated",
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    quantity_card_des = async (req, res) => {
        const { cart_id } = req.params;

        try {
            const product = await cardModel.findById(cart_id);

            const { quantity } = product;

            await cardModel.findByIdAndUpdate(cart_id, {
                quantity: quantity - 1,
            });

            responseReturn(res, 200, {
                message: "Quantity Updated",
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    add_wishlist = async (req, res) => {
        const { productId } = req.body;

        try {
            const product = await wishlistModel.findOne({ productId });
            if (product) {
                responseReturn(res, 404, {
                    error: "Product Is Already In Wishlist",
                });
            } else {
                await wishlistModel.create(req.body);
                responseReturn(res, 201, {
                    message: "Product Add to Wishlist Success",
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    get_wishlist = async (req, res) => {
        const { userId } = req.params;
        try {
            const wishlists = await wishlistModel.find({ userId });

            responseReturn(res, 201, {
                wishlists,
                wishlist_count: wishlists.length,
            });
        } catch (error) {}
    };

    remove_product_wishlist = async (req, res) => {
        const { wishlist_id } = req.params;

        try {
            await wishlistModel.findByIdAndDelete(wishlist_id);
            responseReturn(res, 200, {
                message: "Wishlist Product Remove",
                wishlist_id,
            });
        } catch (error) {
            console.log(error.message);
        }
    };
}

module.exports = new cardController();
