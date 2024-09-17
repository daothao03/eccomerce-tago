import React, { useEffect, useState } from "react";
import { FaImages } from "react-icons/fa6";
import { FadeLoader, PropagateLoader } from "react-spinners";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    add_profile_info,
    profile_image_upload,
} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";
import { messageClear } from "../../store/Reducers/productReducer";
import { overrideStyle } from "../../utils/utils";
import { create_momo_connect_account } from "../../store/Reducers/sellerReducer";
const Profile = () => {
    const dispatch = useDispatch();
    const { userInfo, loader, successMessage, errorMessage } = useSelector(
        (state) => state.auth
    );

    const [state, setState] = useState({
        division: "",
        district: "",
        shopName: "",
        sub_district: "",
    });

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

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const add_image = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData();
            formData.append("image", e.target.files[0]);
            dispatch(profile_image_upload(formData));
        }
    };

    const add_info = (e) => {
        e.preventDefault();
        dispatch(add_profile_info(state));
    };

    return (
        <div className="px-2 lg:px-7 py-5">
            <div className="w-full flex flex-wrap">
                <div className="w-full md:w-6/12">
                    <div className="w-full p-4 bg-primary rounded-md text-[#d0d2d6]">
                        <div className="flex justify-center items-center py-3">
                            {userInfo?.image ? (
                                <label
                                    htmlFor="img"
                                    className="h-[200px] w-[200px] rounded-999 relative p-3 cursor-pointer overflow-hidden"
                                >
                                    <img
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                        src={userInfo.image}
                                        alt=""
                                    />
                                    {loader && (
                                        <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                                            <span>
                                                <FadeLoader />
                                            </span>
                                        </div>
                                    )}
                                </label>
                            ) : (
                                <label
                                    className="flex justify-center items-center flex-col h-[150px] w-[200px] cursor-pointer border border-dashed hover:border-red-500 border-[#d0d2d6] relative"
                                    htmlFor="img"
                                >
                                    <span>
                                        <FaImages />{" "}
                                    </span>
                                    <span>Select Image</span>
                                    {loader && (
                                        <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                                            <span>
                                                <FadeLoader />
                                            </span>
                                        </div>
                                    )}
                                </label>
                            )}
                            <input
                                onChange={add_image}
                                type="file"
                                className="hidden"
                                id="img"
                            />
                        </div>
                        <div className="px-0 md:px-5 py-2">
                            <div className="flex justify-between text-[1.5rem] flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                                <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer">
                                    <FaRegEdit />{" "}
                                </span>
                                <div className="flex gap-2">
                                    <span>Name : </span>
                                    <span>{userInfo.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Email : </span>
                                    <span>{userInfo.email}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Role : </span>
                                    <span>{userInfo.role}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Status : </span>
                                    <span>{userInfo.status}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Payment Account : </span>
                                    <p>
                                        {userInfo.payment === "active" ? (
                                            <span className="bg-red-500 text-white text-[1.2rem] cursor-pointer font-normal ml-2 px-2 py-0.5 rounded">
                                                {userInfo.payment}
                                            </span>
                                        ) : (
                                            <span
                                                onClick={() => {
                                                    dispatch(
                                                        create_momo_connect_account()
                                                    );
                                                }}
                                                className="bg-blue-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded"
                                            >
                                                Click Active
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-0  md:px-5 py-2">
                            {!userInfo?.shopInfo ? (
                                <form
                                    onSubmit={add_info}
                                    className="text-[1.5rem]"
                                >
                                    <div className="flex flex-col w-full gap-1 mb-2">
                                        <label
                                            className="font-semibold"
                                            htmlFor="Shop"
                                        >
                                            Shop Name
                                        </label>
                                        <input
                                            onChange={inputHandle}
                                            value={state.shopName}
                                            className="px-4 py-2 focus:border-indigo-200 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                            type="text"
                                            name="shopName"
                                            id="Shop"
                                            placeholder="Shop Name"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full gap-1 mb-2">
                                        <label
                                            className="font-semibold"
                                            htmlFor="division"
                                        >
                                            Division Name
                                        </label>
                                        <input
                                            onChange={inputHandle}
                                            value={state.division}
                                            className="px-4 py-2 focus:border-indigo-200 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                            type="text"
                                            name="division"
                                            id="division"
                                            placeholder="division Name"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full gap-1 mb-2">
                                        <label
                                            className="font-semibold"
                                            htmlFor="district"
                                        >
                                            District Name
                                        </label>
                                        <input
                                            onChange={inputHandle}
                                            value={state.district}
                                            className="px-4 py-2 focus:border-indigo-200 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                            type="text"
                                            name="district"
                                            id="district"
                                            placeholder="District Name"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full gap-1 mb-2">
                                        <label
                                            className="font-semibold"
                                            htmlFor="sub_district"
                                        >
                                            Sub District Name
                                        </label>
                                        <input
                                            onChange={inputHandle}
                                            value={state.sub_district}
                                            className="px-4 py-2 focus:border-indigo-200 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                            type="text"
                                            name="sub_district"
                                            id="sub_district"
                                            placeholder="Sub District Name"
                                        />
                                    </div>

                                    <button
                                        disabled={loader ? true : false}
                                        type="submit"
                                        className="mt-10 rounded-999 bg-red-800 text-white w-[250px] font-semibold p-3 hover:shadow-red-300/50"
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
                                </form>
                            ) : (
                                <div className="flex justify-between text-[1.3rem] flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                                    <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer">
                                        <FaRegEdit />{" "}
                                    </span>
                                    <div className="flex gap-2">
                                        <span>Shop Name : </span>
                                        <span>
                                            {userInfo.shopInfo?.shopName}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Divission : </span>
                                        <span>
                                            {userInfo.shopInfo?.division}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>District : </span>
                                        <span>
                                            {userInfo.shopInfo?.district}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Sub District : </span>
                                        <span>
                                            {userInfo.shopInfo?.sub_district}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-6/12">
                    <div className="w-full pl-0 md:pl-7 mt-6 md:mt-0">
                        <div className="bg-primary rounded-md text-[#d0d2d6] p-4">
                            <h1 className="text-[#d0d2d6] text-[2rem] mb-3 font-semibold">
                                Change Password
                            </h1>
                            <form>
                                <div className="flex flex-col w-full gap-1 mb-6">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        className="px-4 py-2 focus:border-indigo-200 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="email"
                                    />
                                </div>

                                <div className="flex flex-col w-full gap-1 mb-6">
                                    <label htmlFor="o_password">
                                        Old Password
                                    </label>
                                    <input
                                        className="px-4 py-2 focus:border-indigo-200 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                        type="password"
                                        name="old_password"
                                        id="o_password"
                                        placeholder="Old Password"
                                    />
                                </div>

                                <div className="flex flex-col w-full gap-1 mb-6">
                                    <label htmlFor="n_password">
                                        New Password
                                    </label>
                                    <input
                                        className="px-4 py-2 focus:border-indigo-200 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                        type="password"
                                        name="new_password"
                                        id="n_password"
                                        placeholder="New Password"
                                    />
                                </div>

                                <button className="bg-red-500  hover:shadow-red-500/40 hover:shadow-md text-white rounded-md px-7 py-2 my-2">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
