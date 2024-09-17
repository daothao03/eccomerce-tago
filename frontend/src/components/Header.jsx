import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import {
    FaFacebookF,
    FaList,
    FaLock,
    FaPhoneAlt,
    FaRegUserCircle,
    FaUser,
} from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { get_card, get_wishlist } from "../store/reducers/cardReducer";

const Header = () => {
    const { categories } = useSelector((auth) => auth.home);
    const { userInfo } = useSelector((auth) => auth.auth);
    const { card_product_count, wishlist_count } = useSelector(
        (auth) => auth.card
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { pathname } = useLocation();
    const [showShidebar, setShowShidebar] = useState(true);
    const [categoryShow, setCategoryShow] = useState(true);

    const [searchValue, setSearchValue] = useState("");
    const [category, setCategory] = useState("");

    const search = () => {
        navigate(`/shop?search=${searchValue}&&category=${category}`);
    };

    const redirect_card_page = () => {
        if (userInfo) {
            navigate("/card");
        } else {
            navigate("/login");
        }
    };

    useEffect(() => {
        if (userInfo) {
            dispatch(get_card(userInfo.id));
            dispatch(get_wishlist(userInfo.id));
        }
    }, [userInfo]);

    return (
        <header className="w-full bg-[#C4D1D0] pb-3">
            <div className="w-white">
                <div className="w-[85%] lg:w-[90%] mx-auto">
                    <div className="h-[80px] md-lg:h-[100px] flex justify-between items-center flex-wrap">
                        <div className="md-lg:w-full w-3/12 md-lg:pt-4">
                            <div className="flex justify-between items-center">
                                <Link to="/">
                                    <h1 className="flex font-roboto-slab justify-center font-roboto-slab text-[2.4rem] font-[700] text-black">
                                        TAGO.
                                    </h1>
                                </Link>
                                <div
                                    className="justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden"
                                    onClick={() => setShowShidebar(false)}
                                >
                                    <span>
                                        {" "}
                                        <FaList />{" "}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="md:lg:w-full w-9/12">
                            <div className="flex justify-between md-lg:justify-center items-center flex-wrap pl-8">
                                <ul className="flex justify-start items-start gap-8 text-sm font-bold uppercase md-lg:hidden">
                                    <li>
                                        <Link
                                            to={"/"}
                                            className={`p-2 block ${
                                                pathname === "/"
                                                    ? "text-[#059473]"
                                                    : "text-slate-600"
                                            } `}
                                        >
                                            Home
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to={"/shop"}
                                            className={`p-2 block ${
                                                pathname === "/shop"
                                                    ? "text-[#059473]"
                                                    : "text-slate-600"
                                            } `}
                                        >
                                            Shop
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className={`p-2 block ${
                                                pathname === "/blog"
                                                    ? "text-[#059473]"
                                                    : "text-slate-600"
                                            } `}
                                        >
                                            Blog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className={`p-2 block ${
                                                pathname === "/about"
                                                    ? "text-[#059473]"
                                                    : "text-slate-600"
                                            } `}
                                        >
                                            About Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className={`p-2 block ${
                                                pathname === "/contact"
                                                    ? "text-[#059473]"
                                                    : "text-slate-600"
                                            } `}
                                        >
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>

                                <div className="flex md-lg:hidden justify-center items-center gap-5">
                                    <div className="flex justify-center gap-5">
                                        <div
                                            onClick={() => {
                                                navigate(
                                                    "/dashboard/my-wishlist"
                                                );
                                            }}
                                            className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]"
                                        >
                                            <span className="text-xl text-green-500">
                                                <FaHeart />
                                            </span>
                                            {wishlist_count !== 0 && (
                                                <div className="w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] ">
                                                    {wishlist_count}
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            onClick={redirect_card_page}
                                            className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]"
                                        >
                                            <span className="text-xl text-green-500">
                                                <FaCartShopping />
                                            </span>
                                            {card_product_count !== 0 && (
                                                <div className="w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] ">
                                                    {card_product_count}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* RESPONSIVE HEADER */}
                    <div className="hidden md-lg:block">
                        <div
                            onClick={() => setShowShidebar(true)}
                            className={`fixed duration-200 transition-all ${
                                showShidebar ? "invisible" : "visible"
                            } hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20 `}
                        ></div>
                    </div>
                    <div
                        className={`w-[300px] z-[9999] transition-all duration-200 fixed ${
                            showShidebar ? "-left-[300px]" : "left-0 top-0"
                        } overflow-y-auto bg-white h-screen py-6 px-8 `}
                    >
                        <div className="flex justify-start flex-col gap-6">
                            <Link to="/">
                                <h1 className="flex justify-center font-roboto-slab text-[2rem] font-[700] text-black">
                                    TAGO.
                                </h1>
                            </Link>
                            <div className="flex justify-start items-center gap-10">
                                <div className="flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute ">
                                    <img
                                        src="http://localhost:3000/images/language.png"
                                        alt=""
                                    />
                                    <span>
                                        <IoMdArrowDropdown />
                                    </span>
                                    <ul className="absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10">
                                        <li>VietNam</li>
                                        <li>English</li>
                                    </ul>
                                </div>
                                {userInfo ? (
                                    <Link
                                        className="flex cursor-pointer justify-center items-center gap-2 text-sm text-black"
                                        to="/dashboard"
                                    >
                                        <span>
                                            {" "}
                                            <FaUser />{" "}
                                        </span>
                                        <span>{userInfo.name}</span>
                                    </Link>
                                ) : (
                                    <Link
                                        className="flex cursor-pointer justify-center items-center gap-2 text-sm text-black"
                                        to="/login"
                                    >
                                        <span>
                                            {" "}
                                            <FaLock />{" "}
                                        </span>
                                        <span>Login </span>
                                    </Link>
                                )}
                            </div>

                            <ul className="flex flex-col justify-start items-start text-sm font-bold uppercase">
                                <li>
                                    <Link
                                        className={`py-2 block ${
                                            pathname === "/"
                                                ? "text-[#059473]"
                                                : "text-slate-600"
                                        } `}
                                    >
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className={`py-2 block ${
                                            pathname === "/shop"
                                                ? "text-[#059473]"
                                                : "text-slate-600"
                                        } `}
                                    >
                                        Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`py-2 block ${
                                            pathname === "/blog"
                                                ? "text-[#059473]"
                                                : "text-slate-600"
                                        } `}
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`py-2 block ${
                                            pathname === "/about"
                                                ? "text-[#059473]"
                                                : "text-slate-600"
                                        } `}
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`py-2 block ${
                                            pathname === "/contact"
                                                ? "text-[#059473]"
                                                : "text-slate-600"
                                        } `}
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="flex justify-start items-center gap-4 text-black">
                            <a href="#">
                                <FaFacebookF />
                            </a>
                            <a href="#">
                                <FaTwitter />{" "}
                            </a>
                            <a href="#">
                                <FaLinkedin />
                            </a>
                            <a href="#">
                                <FaGithub />{" "}
                            </a>
                        </div>

                        <div className="w-full flex justify-end md-lg:justify-start gap-3 items-center">
                            <div className="w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center ">
                                <span>
                                    <FaPhoneAlt />
                                </span>
                            </div>
                            <div className="flex justify-end flex-col gap-1">
                                <h2 className="text-sm font-medium text-slate-700">
                                    +134343455
                                </h2>
                                <span className="text-xs">Support 24/7</span>
                            </div>
                        </div>

                        <ul className="flex flex-col justify-start items-start gap-3 text-[#1c1c1c]">
                            <li className="flex justify-start items-center gap-2 text-sm">
                                <span>
                                    <MdEmail />
                                </span>
                                <span>support@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                    {/* END RESPONSIVE HEADER */}
                </div>
            </div>

            <div className="w-[85%] lg:w-[90%] mx-auto">
                <div className="flex w-full flex-wrap md-lg:gap-8">
                    <div className="w-2/12 md-lg:w-full">
                        <div className="bg-white relative">
                            <div
                                onClick={() => setCategoryShow(!categoryShow)}
                                className="h-[50px] bg-[#059473] text-white flex justify-center md-lg:justify-between md-lg:px-6 items-center gap-3 font-bold text-md cursor-pointer"
                            >
                                <div className="flex justify-center items-center gap-3">
                                    <span>
                                        <FaList />
                                    </span>
                                    <span>All Category </span>
                                </div>
                                <span className="pt-1">
                                    <IoIosArrowDown />
                                </span>
                            </div>

                            <div
                                className={`${
                                    categoryShow ? "h-0" : "h-auto"
                                } overflow-hidden transition-all md-lg:relative duration-500 absolute z-[99999] bg-[#dbf3ed] w-full border-x`}
                            >
                                <ul className="py-2 text-slate-600 font-medium">
                                    {categories.map((category) => {
                                        return (
                                            <li
                                                key={category._id}
                                                className="flex justify-start items-center gap-2 px-[24px] py-[6px]"
                                            >
                                                <Link
                                                    to={`/products?category=${category.name}`}
                                                    className="text-sm block"
                                                >
                                                    {category.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="w-10/12 pl-8 md-lg:pl-0 md-lg:w-full">
                        <div className="flex flex-wrap w-full justify-between items-center md-lg:gap-6">
                            <div className="w-10/12 md-lg:w-full">
                                <div className="flex border rounded-999 h-[50px] items-center relative gap-6">
                                    <div className="relative after:absolute after:h-[25px] after:w-[1px] after:bg-[#afafaf] after:-right-[15px] md:hidden">
                                        <select
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                            className="w-[160px] text-slate-600 font-semibold bg-transparent px-2 h-full  outline-0 border-none"
                                            name=""
                                            id=""
                                        >
                                            <option value="">
                                                Select Category
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category._id}
                                                    value={category.name}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        className="w-full relative bg-transparent text-slate-500 outline-0 px-3 h-full"
                                        onChange={(e) =>
                                            setSearchValue(e.target.value)
                                        }
                                        type="text"
                                        name=""
                                        id=""
                                        placeholder="Search..."
                                    />

                                    <button
                                        onClick={search}
                                        className="bg-[#059473] rounded-999 right-0 absolute px-8 h-full font-semibold uppercase text-white"
                                    >
                                        <IoSearch />
                                    </button>
                                </div>
                            </div>

                            <div className="w-2/12 block md-lg:hidden pl-2 md-lg:w-full md-lg:pl-0">
                                {userInfo ? (
                                    <Link
                                        className="flex cursor-pointer justify-end items-center gap-2 text-sm text-black"
                                        to="/dashboard"
                                    >
                                        <span>
                                            <FaRegUserCircle className="text-[1.3rem]" />
                                        </span>
                                        <span className="text-[1rem] font-normal">
                                            {userInfo.name}
                                        </span>
                                    </Link>
                                ) : (
                                    <Link
                                        className=" flex cursor-pointer  justify-end  items-center gap-2 text-sm text-black"
                                        to="/login"
                                    >
                                        <span>
                                            <IoMdLogIn className="text-[1.2rem] " />
                                        </span>
                                        <span className="text-[1.1rem] font-semibold">
                                            Login
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
