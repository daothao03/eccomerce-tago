const formidable = require("formidable");
const { responseReturn } = require("../../utiles/response");
const categoryModel = require("../../models/categoryModel");
const cloudinary = require("cloudinary").v2;

class categoryController {
    add_category = async (req, res) => {
        const form = formidable();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Form parse error:", err);
                responseReturn(res, 404, { error: "Something went wrong" });
            } else {
                let { name } = fields;
                let { image } = files;
                name = name.trim();
                const slug = name.split(" ").join("-");

                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true,
                });

                try {
                    const result = await cloudinary.uploader.upload(
                        image.filepath,
                        { folder: "categories" }
                    );

                    console.log("Cloudinary upload result:", result);

                    if (result) {
                        const category = await categoryModel.create({
                            name,
                            slug,
                            image: result.url,
                        });
                        responseReturn(res, 201, {
                            category,
                            message: "Category Added Successfully",
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

    get_category = async (req, res) => {
        const { page, searchValue, parPage } = req.query;
        // const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            let skipPage = "";
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1);
            }
            if (searchValue && page && parPage) {
                const categories = await categoryModel
                    .find({
                        $text: {
                            $search: searchValue,
                        },
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createAt: -1 });
                const totalCategory = await categoryModel
                    .find({
                        $text: {
                            $search: searchValue,
                        },
                    })
                    .countDocuments();
                responseReturn(res, 200, {
                    categories,
                    totalCategory,
                });
            } else if (searchValue === "" && page && parPage) {
                const categories = await categoryModel
                    .find({})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createAt: -1 });
                const totalCategory = await categoryModel
                    .find({})
                    .countDocuments();
                responseReturn(res, 200, {
                    categories,
                    totalCategory,
                });
            } else {
                const categories = await categoryModel
                    .find({})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createAt: -1 });
                const totalCategory = await categoryModel
                    .find({})
                    .countDocuments();
                responseReturn(res, 200, {
                    categories,
                    totalCategory,
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    };
}

module.exports = new categoryController();
