import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { get_sellers_request } from "../../store/Reducers/sellerReducer";
import Search from "../components/Search";

const SellerRequest = () => {
    const dispatch = useDispatch();
    const { loader, sellers, totalSeller } = useSelector(
        (state) => state.seller
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
        };
        dispatch(get_sellers_request(obj));
    }, [searchValue, currentPage, parPage]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[20px] font-bold mb-3'> Seller Request </h1>

            <div className='w-full p-4 bg-primary rounded-md'>
                <Search
                    setParPage={setParPage}
                    setSearchValue={setSearchValue}
                    searchValue={searchValue}
                />

                <div className='relative overflow-x-auto'>
                    <table className='w-full text-[1.3rem] text-left text-[#d0d2d6]'>
                        <thead className=' text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>
                                    No
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Name
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Email
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Payment Status
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Status
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className='text-[1.2rem]'>
                            {sellers.map((seller, i) => (
                                <tr
                                    className='border-b border-slate-700'
                                    key={i}
                                >
                                    <td
                                        scope='row'
                                        className='py-2 px-4 font-medium whitespace-nowrap'
                                    >
                                        {++i}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-2 px-4 font-medium whitespace-nowrap'
                                    >
                                        {seller.name}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-2 px-4 font-medium whitespace-nowrap'
                                    >
                                        {seller.email}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-2 px-4 font-medium whitespace-nowrap'
                                    >
                                        <span>{seller.payment}</span>{" "}
                                    </td>

                                    <td
                                        scope='row'
                                        className='py-2 px-4 font-medium whitespace-nowrap'
                                    >
                                        <span>{seller.status}</span>
                                    </td>

                                    <td
                                        scope='row'
                                        className='py-2 px-4 font-medium whitespace-nowrap'
                                    >
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link
                                                to={`/admin/dashboard/seller/details/${seller._id}`}
                                                className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'
                                            >
                                                <FaEye />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    {totalSeller <= parPage ? (
                        ""
                    ) : (
                        <div className='w-full justify-end flex mt-4 bottom-4 right-4 '>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={totalSeller}
                                parPage={parPage}
                                showItem={3}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerRequest;
