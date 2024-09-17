import { FaEdit, FaRegImage, FaTrash } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    add_banner,
    banner_update_status,
    delete_banner,
    get_banners,
    messageClear,
} from "../../store/Reducers/bannerReducer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AddBanner = () => {
    const dispatch = useDispatch();
    const { loader, banners, successMessage, errorMessage } = useSelector(
        (state) => state.banner
    );
    const [imageShow, setImageShow] = useState("");
    const [image, setImage] = useState("");

    const imageHandle = (e) => {
        const files = e.target.files;
        const length = files.length;

        if (length > 0) {
            setImage(files[0]);
            setImageShow(URL.createObjectURL(files[0]));
        }
    };

    const add = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("image", image);

        dispatch(add_banner(formData));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setImageShow("");
            dispatch(get_banners());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    useEffect(() => {
        dispatch(get_banners());
    }, []);

    const update_status = (bannerId, newStatus) => {
        dispatch(
            banner_update_status({ bannerId, info: { status: newStatus } })
        );
    };

    const handleDelete = (bannerId) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this banner?"
        );
        if (isConfirmed) {
            dispatch(delete_banner(bannerId));
        }
    };

    return (
        <>
            <div className="px-2 lg:px-7 pt-5">
                <h1 className="text-[#000000] font-semibold text-[1.6rem] mb-3">
                    Add Banner
                </h1>
                <div className="w-full p-4 bg-primary rounded-md">
                    <div className="flex justify-between items-center pb-4">
                        <form onSubmit={add}>
                            <div className="mb-4">
                                <label
                                    className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-white"
                                    htmlFor="image"
                                >
                                    <span className="text-4xl">
                                        <FaRegImage />
                                    </span>
                                    <span>Select Banner Image </span>
                                </label>
                                <input
                                    required
                                    onChange={imageHandle}
                                    className="hidden"
                                    type="file"
                                    id="image"
                                />
                            </div>
                            {imageShow && (
                                <div className="mb-4">
                                    <img
                                        className="w-full h-[300px] object-cover"
                                        src={imageShow}
                                        alt=""
                                    />
                                </div>
                            )}

                            <button
                                disabled={loader ? true : false}
                                className="bg-red-500 w-[280px] hover:shadow-red-300/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                            >
                                {loader ? (
                                    <PropagateLoader
                                        color="#fff"
                                        cssOverride={overrideStyle}
                                    />
                                ) : (
                                    "Add Banner"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="px-2 lg:mx-7 lg:px-7 pt-5 bg-primary mt-7 rounded-md">
                <h1 className="text-[#000000] font-semibold text-[1.6rem] mb-3">
                    Add Banner
                </h1>
                <div className="w-full p-4 bg-primary rounded-md  ">
                    <table className="w-full text-left text-[1.4rem] text-white  ">
                        <thead className="border-slate-700 uppercase border-b text-[1.3rem] ">
                            <tr>
                                <th scope="col" className="py-3 px-4">
                                    Banner ID
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Banner
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Status
                                </th>

                                <th scope="col" className="py-3 px-4">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map((b) => (
                                <tr key={b._id}>
                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap"
                                    >
                                        #{b._id}
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap"
                                    >
                                        <img
                                            className="w-[300px]  object-cover"
                                            src={b.image}
                                            alt=""
                                        />
                                    </td>

                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap text-black"
                                    >
                                        <select
                                            onChange={(e) =>
                                                update_status(
                                                    b._id,
                                                    e.target.value
                                                )
                                            }
                                            className="px-1 rounded-999 flex items-center"
                                            name=""
                                            id=""
                                            value={b.status}
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap"
                                    >
                                        <div className="flex justify-start items-center gap-4">
                                            <Link
                                                onClick={() =>
                                                    handleDelete(b._id)
                                                }
                                                className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
                                            >
                                                <FaTrash />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AddBanner;
