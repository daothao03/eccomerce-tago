import { useEffect, useState } from "react";
import Search from "../components/Search";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../../store/Reducers/productReducer";
import { formatPrice } from "../../utils/utils";

const Products = () => {
    const dispatch = useDispatch();

    const { products, totalProduct } = useSelector((state) => state.product);

    const [currentPage, setCurrentPage] = useState(1);
    const [parPage, setParPage] = useState(5);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
        };
        dispatch(get_products(obj));
    }, [searchValue, currentPage, parPage]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000] font-semibold text-[1.6rem] mb-3'>
                All Product
            </h1>
            <div className='w-full p-4 bg-primary rounded-md'>
                <Search
                    setParPage={setParPage}
                    setSearchValue={setSearchValue}
                    searchValue={searchValue}
                />
                <div className='relative overflow-x-auto mt-5'>
                    <table className='w-full text-left text-[1.3rem] text-white  '>
                        <thead className='border-slate-700 uppercase border-b text-[1.4rem] '>
                            <tr>
                                <th scope='col' className='py-3 px-4'>
                                    No
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Image
                                </th>
                                <th scope='col' className='py-3  px-4'>
                                    Name
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Category
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Brand
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Price
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Discount
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Stock
                                </th>
                                <th scope='col' className='py-3 px-4'>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, i) => (
                                <tr key={product.id}>
                                    <td
                                        scope='row'
                                        className='py-3 px-4 font-medium whitespace-nowrap'
                                    >
                                        {++i}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-3 px-4 font-medium whitespace-nowrap'
                                    >
                                        <img
                                            className='w-[45px] h-[45px]'
                                            src={product.images[0]}
                                            alt=''
                                        />
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-3 max-w-[150px] px-4 font-medium whitespace-nowrap overflow-hidden text-ellipsis'
                                    >
                                        {product.name}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-3 px-4 font-medium whitespace-nowrap'
                                    >
                                        {product.category}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-3 px-4 font-medium whitespace-nowrap'
                                    >
                                        {product.brand}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-3 px-4 font-medium whitespace-nowrap'
                                    >
                                        {formatPrice(product.price)}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-3 px-4 font-medium whitespace-nowrap'
                                    >
                                        {product.discount === 0 ? (
                                            <span>No Discount</span>
                                        ) : (
                                            <span>{product.discount}%</span>
                                        )}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-3 px-4 font-medium whitespace-nowrap'
                                    >
                                        {product.stock}
                                    </td>
                                    <td
                                        scope='row'
                                        className='py-3 px-4 font-medium whitespace-nowrap'
                                    >
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link
                                                to={`/seller/dashboard/edit-product/${product._id}`}
                                                className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'
                                            >
                                                <FaEdit />
                                            </Link>
                                            <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-red-500/50'>
                                                <FaEye />
                                            </Link>
                                            <Link className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'>
                                                <FaTrash />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalProduct <= parPage ? (
                    ""
                ) : (
                    <div className='w-full justify-end flex mt-4 bottom-4 right-4 '>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalProduct}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
