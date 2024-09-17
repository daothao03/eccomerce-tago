const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const sellerModel = require("../../models/sellerModel");
const { responseReturn } = require("../../utiles/response");
const queryProducts = require("../../utiles/queryProducts");
const moment = require("moment");
const reviewModel = require("../../models/reviewModel");
const bannerModel = require("../../models/bannerModel");
const {
    mongo: { ObjectId },
} = require("mongoose");

class homeController {
    formateProduct = (products) => {
        let productArray = [];
        let i = 0;
        while (i < products.length) {
            let temp = [];
            let j = i;

            while (i < products.length) {
                let temp = [];
                let j = i;
                while (j < i + 3) {
                    // lap toi da 3 lan
                    if (products[j]) {
                        temp.push(products[j]);
                    }
                    j++;
                } // sau vong 1 => i = 3
                i = j;
                productArray.push([...temp]);
            }

            return productArray;
        }
    };

    get_categories = async (req, res) => {
        try {
            const categories = await categoryModel.find({});
            responseReturn(res, 200, { categories });
        } catch (error) {
            console.log(error.message);
        }
    };

    get_products = async (req, res) => {
        const products = await productModel.find({}).limit(12).sort({
            createdAt: -1,
        });

        const allproduct1 = await productModel.find({}).limit(9).sort({
            createdAt: -1,
        });

        const latest_product = this.formateProduct(allproduct1);

        const allproduct2 = await productModel.find({}).limit(9).sort({
            rating: -1,
        });

        const top_rated_product = this.formateProduct(allproduct2);

        const allproduct3 = await productModel.find({}).limit(9).sort({
            discount: -1,
        });

        // const topDiscountedProducts = await productModel.aggregate([
        //     { $sort: { discount: -1 } },
        //     { $limit: 9 },
        // ]);

        const discount_product = this.formateProduct(allproduct3);

        responseReturn(res, 200, {
            products,
            latest_product,
            top_rated_product,
            discount_product,
        });
    };

    price_range_product = async (req, res) => {
        try {
            const priceRange = {
                low: 0,
                high: 0,
            };
            // const products = await productModel.find({}).limit(9).sort({
            //     createdAt: -1, // 1 for asc -1 is for Desc
            // });
            // const latest_product = this.formateProduct(products);
            const getForPrice = await productModel.find({}).sort({
                price: 1,
            });
            if (getForPrice.length > 0) {
                priceRange.high = getForPrice[getForPrice.length - 1].price;
                priceRange.low = getForPrice[0].price;
            }
            responseReturn(res, 200, {
                // latest_product,
                priceRange,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    query_products = async (req, res) => {
        const parPage = 9;
        req.query.parPage = parPage;
        console.log(req.query);

        try {
            const products = await productModel.find({}).sort({
                createAt: -1,
            });

            const totalProduct = new queryProducts(products, req.query)
                .categoryQuery()
                .ratingQuery()
                .searchQuery()
                .priceQuery()
                .sortByPrice()
                .countProduct();

            const result = new queryProducts(products, req.query)
                .categoryQuery()
                .ratingQuery()
                .searchQuery()
                .priceQuery()
                .sortByPrice()
                .skip()
                .limit()
                .getProducts();

            responseReturn(res, 200, {
                products: result,
                totalProduct,
                parPage,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    get_product_detail = async (req, res) => {
        const { slug } = req.params;

        try {
            const product = await productModel
                .findOne({ slug })
                .populate("sellerId");

            const relatedProducts = await productModel
                .find({
                    $and: [
                        {
                            _id: {
                                $ne: product.id,
                            },
                        },
                        {
                            category: {
                                $eq: product.category,
                            },
                        },
                    ],
                })
                .limit(12);

            const seller = await sellerModel.findById(product.sellerId);
            responseReturn(res, 200, {
                product,
                relatedProducts,
                seller: {
                    name: seller.name,
                    image: seller.image,
                    shopInfo: seller.shopInfo,
                },
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    customer_review = async (req, res) => {
        const { name, review, rating, productId } = req.body;

        await reviewModel.create({
            productId,
            name,
            rating,
            review,
            date: moment(Date.now()).format("LL"),
        });

        const reviews = await reviewModel.find({ productId });

        let rat = 0;

        for (let i = 0; i < reviews.length; i++) {
            rat += reviews[i].rating;
        }

        let productRating = 0;
        if (reviews.length !== 0) {
            productRating = (rat / reviews.length).toFixed(1);
        }

        await productModel.findByIdAndUpdate(productId, {
            rating: productRating,
        });

        responseReturn(res, 201, {
            message: "Review Added Successfully",
        });
    };

    get_reviews = async (req, res) => {
        // console.log(req.params);
        // console.log(req.query);

        const { productId } = req.params;
        let { pageNo } = parseInt(req.query);

        let parPage = 5;
        const skipPage = parPage * (parseInt(pageNo) - 1);

        try {
            let getRating = await reviewModel.aggregate([
                {
                    $match: {
                        productId: { $eq: new ObjectId(productId) },
                        rating: {
                            $not: {
                                $size: 0,
                            },
                        },
                    },
                },
                {
                    $unwind: "$rating",
                },
                {
                    $group: {
                        _id: "$rating",
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            let rating_review = [
                {
                    rating: 5,
                    sum: 0,
                },
                {
                    rating: 4,
                    sum: 0,
                },
                {
                    rating: 3,
                    sum: 0,
                },
                {
                    rating: 2,
                    sum: 0,
                },
                {
                    rating: 1,
                    sum: 0,
                },
            ];

            for (let i = 0; i < rating_review.length; i++) {
                for (let j = 0; j < getRating.length; j++) {
                    if (rating_review[i].rating === getRating[j]._id) {
                        rating_review[i].sum = getRating[j].count;
                        break;
                    }
                }
            }

            const getAll = await reviewModel.find({ productId });

            const reviews = await reviewModel
                .find({ productId })
                .skip(skipPage)
                .limit(parPage)
                .sort({ createdAt: -1 });

            responseReturn(res, 200, {
                reviews,
                totalReview: getAll.length,
                rating_review,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    get_banners = async (req, res) => {
        try {
            const banners = await bannerModel.find({ status: "active" }).sort({ createdAt: -1 });
            responseReturn(res, 200, { banners });
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = new homeController();
