import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from "../Rating";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import {
    add_to_card,
    add_to_wishlist,
    messageClear,
} from "../../store/reducers/cardReducer";
import { useEffect } from "react";
import toast from "react-hot-toast";

const FeatureProducts = ({ products }) => {
    const dispatch = useDispatch();

    const { errorMessage, successMessage } = useSelector((state) => state.card);
    const { userInfo } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const add_cart = (id) => {
        if (userInfo) {
            dispatch(
                add_to_card({
                    userId: userInfo.id,
                    quantity: 1,
                    productId: id,
                })
            );
        } else {
            navigate("/login");
        }
    };

    const add_wishlist = (p) => {
        dispatch(
            add_to_wishlist({
                userId: userInfo.id,
                productId: p._id,
                name: p.name,
                price: p.price,
                image: p.images[0],
                discount: p.discount,
                rating: p.rating,
                slug: p.slug,
            })
        );
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <div className='w-[85%] flex flex-wrap mx-auto'>
            <div className='w-full'>
                <div className='text-center flex justify-center items-center flex-col text-4xl text-slate-600 font-bold relative pb-[45px]'>
                    <h2>Feature Products </h2>
                    <div className='w-[100px] h-[2px] bg-[#059473] mt-4'></div>
                </div>
            </div>

            <div className='w-full grid grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6'>
                {products.map((product) => (
                    <div
                        key={product._id}
                        className='border rounded-md group transition-all duration-500 hover:shadow-md hover:-mt-3'
                    >
                        <div className='relative overflow-hidden'>
                            {product.discount ? (
                                <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>
                                    {product.discount}%{" "}
                                </div>
                            ) : (
                                ""
                            )}

                            {product.images && product.images.length > 0 ? (
                                <img
                                    className='sm:w-full w-[370px] h-[310px] object-cover'
                                    src={product.images[0]}
                                    alt=''
                                />
                            ) : (
                                <div className='sm:w-full w-[370px] h-[310px] object-cover bg-gray-200 flex items-center justify-center'>
                                    No Image
                                </div>
                            )}
                            <ul className='flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3'>
                                <li
                                    onClick={() => add_wishlist(product)}
                                    className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#059473] hover:text-white hover:rotate-[720deg] transition-all'
                                >
                                    <FaRegHeart />
                                </li>
                                <Link
                                    to={`/product/details/${product.slug}`}
                                    className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#059473] hover:text-white hover:rotate-[720deg] transition-all'
                                >
                                    <FaEye />
                                </Link>
                                <li
                                    onClick={() => add_cart(product._id)}
                                    className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#059473] hover:text-white hover:rotate-[720deg] transition-all'
                                >
                                    <RiShoppingCartLine />
                                </li>
                            </ul>
                        </div>

                        <div className='py-3 text-slate-600 px-2 mt-2'>
                            <h3 className='font-normal  text-[13px] text-[#566363]'>
                                {product.brand}
                            </h3>
                            <h2 className='font-bold text-[1.1rem] w-[270px] whitespace-nowrap overflow-hidden text-ellipsis'>
                                {product.name}
                            </h2>
                            <div className='flex justify-between items-center gap-3'>
                                <span className='text-md font-semibold'>
                                    {formatPrice(product.price)}
                                </span>
                                <div className='flex'>
                                    <Rating ratings={product.rating} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureProducts;
