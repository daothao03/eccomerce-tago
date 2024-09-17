import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    get_card,
    delete_product_card,
    messageClear,
    quantity_card_inc,
    quantity_card_des,
} from "../store/reducers/cardReducer";
import { formatPrice } from "../utils/utils";
import toast from "react-hot-toast";
const Card = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    const {
        card_products,
        successMessage,
        price,
        buy_product_item,
        shipping_fee,
        outofstock_products,
    } = useSelector((state) => state.card);

    const redirect = () => {
        navigate("/shipping", {
            state: {
                products: card_products,
                price: price,
                shipping_fee: shipping_fee,
                items: buy_product_item,
            },
        });
    };

    useEffect(() => {
        dispatch(get_card(userInfo.id));
    }, []);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(get_card(userInfo.id));
        }
    }, [successMessage]);

    const inc = (quantity, stock, cart_id) => {
        const temp = quantity + 1;
        if (temp <= stock) {
            dispatch(quantity_card_inc(cart_id));
        }
    };

    const des = (quantity, cart_id) => {
        const temp = quantity - 1;
        if (temp !== 0 && temp >= 1) {
            dispatch(quantity_card_des(cart_id));
        }
    };

    return (
        <div>
            <Header />

            <section className='bg-[#eeeeee]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16'>
                    {card_products.length > 0 || outofstock_products > 0 ? (
                        <div className='flex flex-wrap'>
                            <div className='w-[67%] md-lg:w-full'>
                                <div className='pr-3 md-lg:pr-0'>
                                    <div className='flex flex-col gap-3'>
                                        <div className='bg-white p-4'>
                                            <h2 className='text-md text-green-500 font-semibold'>
                                                Stock Products
                                                <span className='inline-block ml-2'>
                                                    {card_products.length}
                                                </span>
                                            </h2>
                                        </div>

                                        {card_products.map((product) => (
                                            <div
                                                key={product.products._id}
                                                className='flex bg-white p-4 flex-col gap-2'
                                            >
                                                <div className='flex justify-start items-center'>
                                                    <h2 className='text-md text-slate-600 font-bold'>
                                                        {product.shopName}
                                                    </h2>
                                                </div>

                                                {product.products.map((p) => (
                                                    <div
                                                        key={p._id}
                                                        className='w-full flex flex-wrap pt-6'
                                                    >
                                                        <div className='flex sm:w-full gap-2 w-7/12'>
                                                            <div className='flex gap-2 justify-start items-center'>
                                                                <img
                                                                    className='w-[80px] h-[80px]'
                                                                    src={
                                                                        p
                                                                            .productInfo
                                                                            .images[0]
                                                                    }
                                                                    alt={
                                                                        p
                                                                            .productInfo
                                                                            .name
                                                                    }
                                                                />
                                                                <div className='pr-4 text-slate-600'>
                                                                    <h2 className='text-md font-semibold line-clamp-2'>
                                                                        {
                                                                            p
                                                                                .productInfo
                                                                                .name
                                                                        }
                                                                    </h2>
                                                                    <span className='text-sm'>
                                                                        Brand:
                                                                        {
                                                                            p
                                                                                .productInfo
                                                                                .brand
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                                                            <div className='pl-4 sm:pl-0'>
                                                                <h2 className='text-lg text-orange-500'>
                                                                    {formatPrice(
                                                                        p
                                                                            .productInfo
                                                                            .price -
                                                                            Math.floor(
                                                                                (p
                                                                                    .productInfo
                                                                                    .price *
                                                                                    p
                                                                                        .productInfo
                                                                                        .discount) /
                                                                                    100
                                                                            )
                                                                    )}
                                                                </h2>
                                                                <p className='line-through'>
                                                                    {formatPrice(
                                                                        p
                                                                            .productInfo
                                                                            .price
                                                                    )}
                                                                </p>
                                                                {p.productInfo
                                                                    .discount >
                                                                0 ? (
                                                                    <p>
                                                                        -
                                                                        {
                                                                            p
                                                                                .productInfo
                                                                                .discount
                                                                        }
                                                                        %
                                                                    </p>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                            <div className='flex gap-2 flex-col'>
                                                                <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
                                                                    <div
                                                                        onClick={() =>
                                                                            des(
                                                                                p.quantity,

                                                                                p._id
                                                                            )
                                                                        }
                                                                        className='px-3 cursor-pointer'
                                                                    >
                                                                        -
                                                                    </div>
                                                                    <div className='px-3'>
                                                                        {
                                                                            p.quantity
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        onClick={() =>
                                                                            inc(
                                                                                p.quantity,
                                                                                p
                                                                                    .productInfo
                                                                                    .stock,
                                                                                p._id
                                                                            )
                                                                        }
                                                                        className='px-3 cursor-pointer'
                                                                    >
                                                                        +
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            delete_product_card(
                                                                                p._id
                                                                            )
                                                                        )
                                                                    }
                                                                    className='px-5 py-[3px] bg-red-500 text-white'
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}

                                        {outofstock_products.length > 0 && (
                                            <div className='flex flex-col gap-3'>
                                                <div className='bg-white p-4'>
                                                    <h2 className='text-md text-red-500 font-semibold'>
                                                        Out of Stock
                                                        <span className='inline-block ml-2'>
                                                            {
                                                                outofstock_products.length
                                                            }
                                                        </span>
                                                    </h2>
                                                </div>

                                                <div className='bg-white p-4'>
                                                    {outofstock_products.map(
                                                        (product) => (
                                                            <div
                                                                key={
                                                                    product
                                                                        .products[0]
                                                                        ._id
                                                                }
                                                                className='w-full flex flex-wrap pt-5'
                                                            >
                                                                <div className='flex sm:w-full gap-2 w-7/12'>
                                                                    <div className='flex gap-2 justify-start items-center'>
                                                                        {product
                                                                            .products[0]
                                                                            .images &&
                                                                        product
                                                                            .products[0]
                                                                            .images
                                                                            .length >
                                                                            0 ? (
                                                                            <img
                                                                                className='w-[80px] h-[80px]'
                                                                                src={
                                                                                    product
                                                                                        .products[0]
                                                                                        .images[0]
                                                                                }
                                                                                alt=''
                                                                            />
                                                                        ) : (
                                                                            ""
                                                                        )}

                                                                        <div className='pr-4 text-slate-600'>
                                                                            <h2 className='text-md font-semibold line-clamp-2'>
                                                                                {
                                                                                    product
                                                                                        .products[0]
                                                                                        .name
                                                                                }
                                                                            </h2>
                                                                            <span className='text-sm'>
                                                                                Brand:
                                                                                {
                                                                                    product
                                                                                        .products[0]
                                                                                        .brand
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                                                                    <div className='pl-4 sm:pl-0'>
                                                                        <h2 className='text-lg text-orange-500'>
                                                                            {formatPrice(
                                                                                product
                                                                                    .products[0]
                                                                                    .price -
                                                                                    Math.floor(
                                                                                        (product
                                                                                            .products[0]
                                                                                            .price *
                                                                                            product
                                                                                                .products[0]
                                                                                                .discount) /
                                                                                            100
                                                                                    )
                                                                            )}
                                                                        </h2>
                                                                        <p className='line-through'>
                                                                            {formatPrice(
                                                                                product
                                                                                    .products[0]
                                                                                    .price
                                                                            )}
                                                                        </p>
                                                                        {product
                                                                            .products[0]
                                                                            .discount >
                                                                        0 ? (
                                                                            <p>
                                                                                -
                                                                                {
                                                                                    product
                                                                                        .products[0]
                                                                                        .discount
                                                                                }

                                                                                %
                                                                            </p>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </div>
                                                                    <div className='flex gap-2 flex-col'>
                                                                        <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
                                                                            <div className='px-3 cursor-pointer'>
                                                                                -
                                                                            </div>
                                                                            <div className='px-3'>
                                                                                2
                                                                            </div>
                                                                            <div className='px-3 cursor-pointer'>
                                                                                +
                                                                            </div>
                                                                        </div>
                                                                        <button className='px-5 py-[3px] bg-red-500 text-white'>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='w-[33%] md-lg:w-full'>
                                <div className='pl-3 md-lg:pl-0 md-lg:mt-5'>
                                    {card_products.length > 0 && (
                                        <div className='bg-white p-3 text-slate-600 flex flex-col gap-3'>
                                            <h2 className='text-xl font-bold'>
                                                Order Summary
                                            </h2>
                                            <div className='flex justify-between items-center'>
                                                <span>
                                                    {buy_product_item} Items
                                                </span>
                                                <span>
                                                    {formatPrice(price)}
                                                </span>
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <span>Shipping Fee </span>
                                                <span>
                                                    {formatPrice(shipping_fee)}{" "}
                                                </span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <input
                                                    className='w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-sm'
                                                    type='text'
                                                    placeholder='Input Vauchar Coupon'
                                                />
                                                <button className='px-5 py-[1px] bg-[#059473] text-white rounded-sm uppercase text-sm'>
                                                    Apply
                                                </button>
                                            </div>

                                            <div className='flex justify-between items-center'>
                                                <span>Total</span>
                                                <span className='text-lg text-[#059473]'>
                                                    {formatPrice(
                                                        price + shipping_fee
                                                    )}
                                                </span>
                                            </div>
                                            <button
                                                onClick={redirect}
                                                className='px-5 py-[6px] rounded-sm hover:shadow-red-500/50 hover:shadow-lg bg-red-500 text-sm text-white uppercase '
                                            >
                                                Process to Checkout (
                                                {buy_product_item})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Link
                                className='px-4 py-1 bg-indigo-500 text-white'
                                to='/shops'
                            >
                                {" "}
                                Shop Now
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Card;
