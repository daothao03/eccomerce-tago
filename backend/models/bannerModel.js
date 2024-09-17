const { Schema, model } = require("mongoose");

const bannerSchema = new Schema(
    {
        image: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "active",
        },
    },
    { timestamps: true }
);

module.exports = model("banners", bannerSchema);
