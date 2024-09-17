import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { FaEye } from "react-icons/fa";

import Search from "../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { get_active_sellers } from "../../store/Reducers/sellerReducer";

const Sellers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(10);
    const [show, setShow] = useState(false);

    const dispatch = useDispatch();

    const { totalSeller, sellers } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(
            get_active_sellers({
                parPage: parseInt(parPage),
                page: parseInt(currentPage),
                searchValue,
            })
        );
    }, [parPage, currentPage, searchValue]);

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-primary rounded-md">
                <Search
                    setParPage={setParPage}
                    setSearchValue={setSearchValue}
                    searchValue={searchValue}
                />

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left text-[#d0d2d6]">
                        <thead className="text-[1.3rem] text-[#d0d2d6] uppercase border-b border-slate-700">
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
                                    Shop Name
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Payment Status
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Email
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Devision
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    District
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-[1.1rem]">
                            {sellers.map((d, i) => (
                                <tr key={d._id}>
                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        {i + 1}
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        <img
                                            className="w-[45px] h-[45px]"
                                            src={
                                                d.image
                                                    ? d.image
                                                    : `http://localhost:3000/images/admin.jpg`
                                            }
                                            alt=""
                                        />
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        {d.name}
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        {d.shopInfo?.shopName}
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        <span>{d.payment}</span>
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        {d.email}
                                    </td>

                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        {d.shopInfo?.division}
                                    </td>

                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        {d.shopInfo?.district}
                                    </td>

                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        <div className="flex justify-start items-center gap-4">
                                            <Link
                                                to={`/admin/dashboard/seller/details/${d._id}`}
                                                className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                                            >
                                                <FaEye />{" "}
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                    {totalSeller >= parPage && (
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalSeller}
                            parPage={parPage}
                            showItem={3}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sellers;
