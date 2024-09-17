import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdImages } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../store/Reducers/categoryReducer";
import {
    add_product,
    messageClear,
} from "./../../store/Reducers/productReducer";
import { overrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";

const AddProduct = () => {
    const dispatch = useDispatch();

    const { categories } = useSelector((state) => state.category);

    const { loader, errorMessage, successMessage } = useSelector(
        (state) => state.product
    );
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

    const [state, setState] = useState({
        name: "",
        short_description: "",
        long_description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
    });

    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState("");
    const [allCategory, setAllCategory] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const [images, setImages] = useState([]);
    const [imageShow, setImageShow] = useState([]);

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

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
            setImages([...images, ...files]);
            let imageUrl = [];
            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) });
            }
            setImageShow([...imageShow, ...imageUrl]);
        }
    };

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow;
            let tempImages = images;
            tempImages[index] = img;
            tempUrl[index] = { url: URL.createObjectURL(img) };
            setImageShow([...tempUrl]);
            setImages([...tempImages]);
        }
    };

    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i);
        const filterImageUrl = imageShow.filter((img, index) => index !== i);

        setImages(filterImage);
        setImageShow(filterImageUrl);
    };

    // Submit form POST
    const addProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", state.name);
        formData.append("short_description", state.short_description);
        formData.append("long_description", state.long_description);
        formData.append("discount", state.discount);
        formData.append("price", state.price);
        formData.append("brand", state.brand);
        formData.append("stock", state.stock);
        formData.append("category", category);
        formData.append("shopName", "TAGO");

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        // console.log(state);

        dispatch(add_product(formData));
    };

    useEffect(() => {
        setAllCategory(categories);
    }, [categories]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            setState({
                name: "",
                short_description: "",
                long_description: "",
                discount: "",
                price: "",
                brand: "",
                stock: "",
            });
            setImageShow([]);
            setImages([]);
            setCategory("");
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-primary rounded-md'>
                <div className='flex justify-between items-center pb-4'>
                    <h1 className='text-[#d0d2d6] text-xl font-semibold'>
                        Add Product
                    </h1>
                    <Link
                        to={"/seller/dashboard/all-product"}
                        className='bg-tranparent font-bold hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-999 border px-7 py-2 my-2'
                    >
                        All Product
                    </Link>
                </div>
                <div>
                    <form onSubmit={addProduct}>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor='name'>Product Name</label>
                                <input
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]'
                                    onChange={inputHandle}
                                    value={state.name}
                                    type='text'
                                    name='name'
                                    id='name'
                                    placeholder='Product Name'
                                />
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor='brand'>Product Brand</label>
                                <input
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]'
                                    onChange={inputHandle}
                                    value={state.brand}
                                    type='text'
                                    name='brand'
                                    id='brand'
                                    placeholder='Brand Name'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                            <div className='flex flex-col w-full gap-1 relative'>
                                <label htmlFor='category'>Category</label>
                                <input
                                    readOnly
                                    onClick={() => setCateShow(!cateShow)}
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]'
                                    onChange={inputHandle}
                                    value={category}
                                    type='text'
                                    id='category'
                                    placeholder='--select category--'
                                />
                                <div
                                    className={`absolute top-[101%] bg-[#475569] w-full transition-all ${
                                        cateShow ? "scale-100" : "scale-0"
                                    } `}
                                >
                                    <div className='w-full px-4 py-2 fixed'>
                                        <input
                                            value={searchValue}
                                            onChange={categorySearch}
                                            className='px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden'
                                            type='text'
                                            placeholder='search'
                                        />
                                    </div>
                                    <div className='pt-14'></div>
                                    <div className='flex justify-start items-start flex-col h-auto overflow-x-scrool'>
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
                                                {c.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor='stock'>Product Stock</label>
                                <input
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]'
                                    onChange={inputHandle}
                                    value={state.stock}
                                    type='text'
                                    name='stock'
                                    id='stock'
                                    placeholder='Stock'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor='price'>Price</label>
                                <input
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]'
                                    onChange={inputHandle}
                                    value={state.price}
                                    type='number'
                                    name='price'
                                    id='price'
                                    placeholder='price'
                                />
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor='discount'>Discount</label>
                                <input
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]'
                                    onChange={inputHandle}
                                    value={state.discount}
                                    type='number'
                                    name='discount'
                                    id='discount'
                                    placeholder='discount by %'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-5'>
                            <label
                                htmlFor='short_description'
                                className='text-[#d0d2d6]'
                            >
                                Short Description
                            </label>
                            <input
                                className='px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]'
                                onChange={inputHandle}
                                value={state.short_description}
                                name='short_description'
                                id='short_description'
                                placeholder='Description'
                                cols='10'
                                rows='4'
                            ></input>
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-5'>
                            <label
                                htmlFor='long_description'
                                className='text-[#d0d2d6]'
                            >
                                Long Description
                            </label>
                            <textarea
                                className='px-4 py-2 focus:border-indigo-500 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]'
                                onChange={inputHandle}
                                value={state.long_description}
                                name='long_description'
                                id='long_description'
                                placeholder='Long Description'
                                cols='10'
                                rows='4'
                            ></textarea>
                        </div>
                        <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 gap-3 w-full text-[#d0d2d6] mb-4'>
                            {imageShow.map((img, i) => (
                                <div className='h-[180px] relative'>
                                    <label htmlFor={i}>
                                        <img
                                            className='w-full h-full rounded-sm object-contain'
                                            src={img.url}
                                            alt=''
                                        />
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            changeImage(e.target.files[0], i)
                                        }
                                        type='file'
                                        id={i}
                                        className='hidden'
                                    />
                                    <span
                                        onClick={() => removeImage(i)}
                                        className='p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full'
                                    >
                                        <IoMdCloseCircle />
                                    </span>
                                </div>
                            ))}

                            <label
                                className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-[#d0d2d6]'
                                htmlFor='image'
                            >
                                <span>
                                    <IoMdImages />
                                </span>
                                <span>Select Image </span>
                            </label>
                            <input
                                className='hidden'
                                onChange={imageHandle}
                                multiple
                                type='file'
                                id='image'
                            />
                        </div>

                        <div className='flex'>
                            <button
                                disabled={loader ? true : false}
                                type='submit'
                                className='mt-10 rounded-999 bg-red-800 text-white w-[290px] font-semibold p-3 hover:shadow-red-300/50'
                            >
                                {loader ? (
                                    <PropagateLoader
                                        color='#fff'
                                        cssOverride={overrideStyle}
                                    />
                                ) : (
                                    "Add Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default AddProduct;
