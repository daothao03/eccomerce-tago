import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdImages } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../store/Reducers/categoryReducer";
import {
    get_product,
    messageClear,
    product_image_update,
    update_product,
} from "../../store/Reducers/productReducer";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import toast from "react-hot-toast";

const EditProduct = () => {
    const dispatch = useDispatch();

    const { categories } = useSelector((state) => state.category);
    const { product, loader, errorMessage, successMessage } = useSelector(
        (state) => state.product
    );

    const { productId } = useParams();

    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState("");
    const [allCategory, setAllCategory] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    // image hiện tại
    const [imageShow, setImageShow] = useState([]);

    //image thêm vào chuẩn bị update
    const [newImages, setNewImages] = useState([]);
    const [newImageShow, setNewImageShow] = useState([]);

    const [state, setState] = useState({
        name: "",
        short_description: "",
        long_description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    //GET Categories
    useEffect(() => {
        dispatch(
            getCategory({
                page: "",
                searchValue: "",
                parPage: "",
            })
        );
    }, []);

    //GET info product by id
    useEffect(() => {
        dispatch(get_product(productId));
    }, [productId]);

    useEffect(() => {
        if (categories.length > 0) {
            setAllCategory(categories);
        }
    }, [categories]);

    //search category
    const categorySearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value) {
            let srcValue = allCategory.filter(
                (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
            );
            setAllCategory(srcValue);
        } else {
            setAllCategory(categories);
        }
    };

    const imageHandle = (e) => {
        const files = e.target.files;
        const length = files.length;
        if (length > 0) {
            setNewImages([...newImages, ...files]);
            let imageUrl = [];
            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) });
            }
            setNewImageShow([...newImageShow, ...imageUrl]);
        }
    };

    const handleNewImageChange = (img, index) => {
        if (img) {
            let tempUrl = newImageShow;
            let tempImages = newImageShow;
            tempImages[index] = img;
            tempUrl[index] = { url: URL.createObjectURL(img) };
            setNewImageShow([...tempUrl]);
            setNewImages([...tempImages]);
        }
    };

    const removeImage = (i) => {
        const filterImage = newImages.filter((img, index) => index !== i);
        const filterImageUrl = newImageShow.filter((img, index) => index !== i);

        setNewImages(filterImage);
        setNewImageShow(filterImageUrl);
    };

    //cal api update image
    const changeImage = (img, files) => {
        if (files.length > 0) {
            dispatch(
                product_image_update({
                    oldImage: img,
                    newImage: files[0],
                    productId,
                })
            );
        }
    };

    //lưu thông tin product vào các state để hiển thị
    useEffect(() => {
        setState({
            name: product.name,
            short_description: product.short_description,
            long_description: product.long_description,
            discount: product.discount,
            price: product.price,
            brand: product.brand,
            stock: product.stock,
        });
        setCategory(product.category);

        const imagesArray = Array.isArray(product.images)
            ? product.images
            : [product.images];
        setImageShow(imagesArray);
    }, [product]);

    //hiển thị toast
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage]);

    //call api update product
    const updateProduct = (e) => {
        e.preventDefault();
        const obj = {
            name: state.name,
            short_description: state.short_description,
            long_description: state.long_description,
            discount: state.discount,
            price: state.price,
            brand: state.brand,
            stock: state.stock,
            productId: productId,
        };
        if (newImages.length < 0) {
            dispatch(update_product(obj));
        } else {
            newImages.forEach((newImage) => {
                dispatch(
                    product_image_update({
                        oldImage: "",
                        newImage: newImage,
                        productId,
                    })
                );
                setNewImageShow([]);
            });
        }
    };

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-primary rounded-md">
                <div className="flex justify-between items-center pb-4">
                    <h1 className="text-[#d0d2d6] text-[2rem] font-semibold">
                        Edit Product
                    </h1>
                    <Link
                        to="/seller/dashboard/all-product"
                        className="bg-transparent border rounded-999 hover:shadow-blue-500/50 hover:shadow-lg font-bold text-white px-7 py-2 my-2"
                    >
                        All Product
                    </Link>
                </div>
                <div>
                    <form onSubmit={updateProduct}>
                        <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
                            <div className="flex flex-col w-full gap-1">
                                <label className="text-[1.3rem]" htmlFor="name">
                                    Product Name
                                </label>
                                <input
                                    className="text-[1.3rem] px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                    onChange={inputHandle}
                                    value={state.name}
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Product Name"
                                />
                            </div>

                            <div className="flex flex-col w-full gap-1">
                                <label
                                    className="text-[1.3rem]"
                                    htmlFor="brand"
                                >
                                    Product Brand
                                </label>
                                <input
                                    className="text-[1.3rem] px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                    onChange={inputHandle}
                                    value={state.brand}
                                    type="text"
                                    name="brand"
                                    id="brand"
                                    placeholder="Brand Name"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
                            <div className="flex flex-col w-full gap-1 relative">
                                <label
                                    className="text-[1.3rem]"
                                    htmlFor="category"
                                >
                                    Category
                                </label>
                                <input
                                    readOnly
                                    onClick={() => setCateShow(!cateShow)}
                                    className="text-[1.3rem] px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                    onChange={inputHandle}
                                    value={category}
                                    type="text"
                                    id="category"
                                    placeholder="--select category--"
                                />

                                <div
                                    className={`absolute top-[101%] bg-[#475569] w-full transition-all ${
                                        cateShow ? "scale-100" : "scale-0"
                                    } `}
                                >
                                    <div className="w-full px-4 py-2 fixed">
                                        <input
                                            value={searchValue}
                                            onChange={categorySearch}
                                            className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                                            type="text"
                                            placeholder="search"
                                        />
                                    </div>
                                    <div className="pt-14"></div>
                                    <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scrool">
                                        {allCategory.map((c, i) => (
                                            <span
                                                className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                                                    category === c.name &&
                                                    "bg-indigo-500"
                                                }`}
                                                onClick={() => {
                                                    setCateShow(false);
                                                    setCategory(c.name);
                                                    setSearchValue("");
                                                    setAllCategory(categories);
                                                }}
                                            >
                                                {c.name}{" "}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col w-full gap-1">
                                <label
                                    className="text-[1.3rem]"
                                    htmlFor="stock"
                                >
                                    Product Stock
                                </label>
                                <input
                                    className="text-[1.3rem] px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                    onChange={inputHandle}
                                    value={state.stock}
                                    type="text"
                                    name="stock"
                                    id="stock"
                                    placeholder="Stock"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
                            <div className="flex flex-col w-full gap-1">
                                <label
                                    className="text-[1.3rem]"
                                    htmlFor="price"
                                >
                                    Price
                                </label>
                                <input
                                    className="text-[1.3rem] px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                    onChange={inputHandle}
                                    value={state.price}
                                    type="number"
                                    name="price"
                                    id="price"
                                    placeholder="price"
                                />
                            </div>

                            <div className="flex flex-col w-full gap-1">
                                <label
                                    className="text-[1.3rem]"
                                    htmlFor="discount"
                                >
                                    Discount
                                </label>
                                <input
                                    className="text-[1.3rem] px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                    onChange={inputHandle}
                                    value={state.discount}
                                    type="number"
                                    name="discount"
                                    id="discount"
                                    placeholder="discount by %"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-1 mb-5">
                            <label
                                htmlFor="short_description"
                                className="text-[#d0d2d6]"
                            >
                                Short Description
                            </label>
                            <input
                                className="px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                onChange={inputHandle}
                                value={state.short_description}
                                name="short_description"
                                id="short_description"
                                placeholder="Description"
                            ></input>
                        </div>

                        <div className="flex flex-col w-full gap-1 mb-5">
                            <label
                                htmlFor="long_description"
                                className="text-[#d0d2d6]"
                            >
                                Long Description
                            </label>
                            <textarea
                                className="px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                onChange={inputHandle}
                                value={state.long_description}
                                name="long_description"
                                id="long_description"
                                placeholder="Description"
                                cols="10"
                                rows="4"
                            ></textarea>
                        </div>

                        <div className="grid lg:grid-cols-5 grid-cols-2 md:grid-cols-4 sm:grid-cols-3 sm:gap-4 md:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
                            {imageShow &&
                                imageShow.length > 0 &&
                                imageShow.map((img, i) => (
                                    <div>
                                        <label htmlFor={i}>
                                            <img
                                                src={img}
                                                alt=""
                                                className="object-contain w-[150px] h-[150px]"
                                            />
                                        </label>
                                        <input
                                            onChange={(e) =>
                                                changeImage(img, e.target.files)
                                            }
                                            type="file"
                                            id={i}
                                            className="hidden"
                                        />
                                    </div>
                                ))}
                        </div>

                        <span className="block w-full text-white  p-2 cursor-pointer">
                            Upload New Image
                        </span>
                        <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
                            {newImageShow.map((img, i) => (
                                <div className="h-[180px] relative">
                                    <label htmlFor={i}>
                                        <img
                                            className="w-full h-full rounded-sm object-contain"
                                            src={img.url}
                                            alt=""
                                        />
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            handleNewImageChange(
                                                e.target.files[0],
                                                i
                                            )
                                        }
                                        type="file"
                                        id={i}
                                        className="hidden"
                                    />
                                    <span
                                        onClick={() => removeImage(i)}
                                        className="p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
                                    >
                                        <IoMdCloseCircle />
                                    </span>
                                </div>
                            ))}

                            <label
                                className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-[#d0d2d6]"
                                htmlFor="image"
                            >
                                <span>
                                    <IoMdImages />
                                </span>
                                <span>Select Image </span>
                            </label>
                            <input
                                className="hidden"
                                onChange={imageHandle}
                                multiple
                                type="file"
                                id="image"
                            />
                        </div>

                        <div className="flex">
                            <button
                                disabled={loader ? true : false}
                                type="submit"
                                className="mt-10 rounded-999 bg-red-800 text-white w-[290px] font-semibold p-3 hover:shadow-red-300/50"
                            >
                                {loader ? (
                                    <PropagateLoader
                                        color="#fff"
                                        cssOverride={overrideStyle}
                                    />
                                ) : (
                                    "Save Change"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
