import { useEffect, useState } from "react";
import { FaEdit, FaImage, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { IoMdCloseCircle } from "react-icons/io";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import {
    categoryAdd,
    getCategory,
} from "./../../store/Reducers/categoryReducer";
import toast from "react-hot-toast";
import { messageClear } from "../../store/Reducers/authReducer";
import Search from "../components/Search";

const Category = () => {
    const dispatch = useDispatch();

    const { loader, errorMessage, successMessage, categories, totalCategory } =
        useSelector((state) => state.category);

    const [currentPage, setCurrentPage] = useState(1);
    const [parPage, setParPage] = useState(5);
    const [searchValue, setSearchValue] = useState("");
    const [show, setShow] = useState(false);

    const [state, setState] = useState({
        name: "",
        image: "",
    });

    const [imageShow, setImageShow] = useState("");

    const imageHandle = (e) => {
        let files = e.target.files;
        if (files.length > 0) {
            setImageShow(URL.createObjectURL(files[0]));
            setState({
                ...state,
                image: files[0],
            });
        }
    };

    const add_category = (e) => {
        e.preventDefault();
        dispatch(categoryAdd(state));
        // console.log(state);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setState({
                name: "",
                image: "",
            });
            setImageShow("");
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage]);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
        };
        dispatch(getCategory(obj));
    }, [searchValue, currentPage, parPage]);

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-primary rounded-md">
                <h1 className="text-[#d0d2d6] font-semibold text-lg">
                    Category
                </h1>
                <button
                    onClick={() => setShow(true)}
                    className="bg-red-500 shadow-lg hover:shadow-red-500/40 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
                >
                    Add
                </button>
            </div>
            <div className="flex flex-wrap w-full">
                <div className="w-full lg:w-7/12">
                    <div className="w-full p-4 bg-primary rounded-md">
                        <Search
                            setParPage={setParPage}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                        />

                        <div className="relative overflow-x-auto ">
                            <table className="w-full text-left text-[1.3rem] text-white  ">
                                <thead className="border-slate-700 uppercase border-b text-[1.4rem] ">
                                    <tr>
                                        <th scope="col" className="py-3 px-4">
                                            No
                                        </th>
                                        <th scope="col" className="py-3 px-4">
                                            Image
                                        </th>
                                        <th scope="col" className="py-3 px-4">
                                            Name
                                        </th>
                                        <th scope="col" className="py-3 px-4">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category, i) => (
                                        <tr key={category.id}>
                                            <td
                                                scope="row"
                                                className="py-3 px-4 font-medium whitespace-nowrap"
                                            >
                                                {++i}
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-3 px-4 font-medium whitespace-nowrap"
                                            >
                                                <img
                                                    className="w-[45px] h-[45px]"
                                                    src={category.image}
                                                    alt={category.name}
                                                />
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-3 px-4 font-medium whitespace-nowrap"
                                            >
                                                {category.name}
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-3 px-4 font-medium whitespace-nowrap"
                                            >
                                                <div className="flex justify-start items-center gap-4">
                                                    <Link className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50">
                                                        <FaEdit />
                                                    </Link>
                                                    <Link className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50">
                                                        <FaTrash />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalCategory <= parPage ? (
                            ""
                        ) : (
                            <div className="w-full justify-end flex mt-4 bottom-4 right-4 ">
                                <Pagination
                                    pageNumber={currentPage}
                                    setPageNumber={setCurrentPage}
                                    totalItem={totalCategory}
                                    parPage={parPage}
                                    showItem={3}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${
                        show ? "right-0" : "-right-[340px]"
                    } z-[9999] top-0 transition-all duration-500 `}
                >
                    <div className="w-full pl-5">
                        <div className="bg-primary h-screen lg:h-auto px-4 py-[22px] lg:rounded-md text-white">
                            <div className="flex justify-between items-center mb-2">
                                <h1 className="text-[#d0d2d6] font-semibold text-[1.5rem] mb-4 w-full text-center ">
                                    Add Category
                                </h1>

                                <div
                                    onClick={() => setShow(false)}
                                    className="block lg:hidden"
                                >
                                    <IoMdCloseCircle />
                                </div>
                            </div>
                            <form onSubmit={add_category}>
                                <div className="flex flex-col w-full gap-1 mb-3">
                                    <label
                                        className="text-[1.4rem]"
                                        htmlFor="name"
                                    >
                                        Category Name
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setState({
                                                ...state,
                                                name: e.target.value,
                                            })
                                        }
                                        value={state.name}
                                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                                        type="text"
                                        id="name"
                                        name="category_name"
                                        placeholder="Category Name"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-red-500 w-full border-[#d0d2d6]"
                                        htmlFor="image"
                                    >
                                        {imageShow ? (
                                            <img
                                                src={imageShow}
                                                className="w-full h-full object-contain"
                                                alt=""
                                            />
                                        ) : (
                                            <>
                                                <span>
                                                    <FaImage />
                                                </span>
                                                <span>Select Image</span>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        onChange={imageHandle}
                                        className="hidden"
                                        type="file"
                                        name="image"
                                        id="image"
                                    />
                                    <div>
                                        <button
                                            disabled={loader ? true : false}
                                            type="submit"
                                            className="mt-4 bg-red-500 hover:shadow-red-300/50 w-[100%] text-white font-semibold p-3"
                                        >
                                            {loader ? (
                                                <PropagateLoader
                                                    color="#fff"
                                                    cssOverride={overrideStyle}
                                                />
                                            ) : (
                                                "Add Category"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;
