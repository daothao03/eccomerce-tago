const { Schema, model } = require("mongoose");

const sellerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            default: "seller",
        },
        status: {
            type: String,
            default: "pending",
        },
        payment: {
            type: String,
            default: "inactive",
        },
        image: {
            type: String,
            default: "",
        },
        // phuong thuc dang nhap gg, fb, ...
        method: {
            type: String,
            required: true,
        },
        shopInfo: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true }
);

sellerSchema.index(
    {
        name: "text",
        email: "text",
    },
    {
        weights: {
            name: 2,
            email: 1,
        },
    }
);

module.exports = model("sellers", sellerSchema);
