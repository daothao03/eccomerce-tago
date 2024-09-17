const { Schema, model } = require("mongoose");

const productSchema = new Schema(
    {
        sellerId: {
            type: Schema.ObjectId,
            required: true,
            // ref: "sellers",
        },
        name: {
            type: String,
            required: true,
            minlength: 3,
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        short_description: {
            type: String,
            required: true,
        },
        long_description: {
            type: String,
            required: true,
        },
        shopName: {
            type: String,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

productSchema.index(
    {
        name: "text",
        category: "text",
        brand: "text",
        short_description: "text",
        long_description: "text",
    },
    {
        weights: {
            name: 5,
            category: 4,
            brand: 3,
            short_description: 2,
            long_description: 1,
        },
    }
);

module.exports = model("products", productSchema);
