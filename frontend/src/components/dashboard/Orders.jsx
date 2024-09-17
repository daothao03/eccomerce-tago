import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_orders } from "../../store/reducers/orderReducer";
import { formatPrice } from "./../../utils/utils";

const Orders = () => {
    const [state, setState] = useState("all");

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const { myOrders } = useSelector((state) => state.order);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(
            get_orders({
                customerId: userInfo.id,
                status: state,
            })
        );
    }, [state]);

    const redirect = (order) => {
        let items = 0;

        for (let i = 0; i < order.length; i++) {
            items = order.products[i].quantity + items;
        }

        navigate("/payment", {
            state: {
                price: order.price,
                items,
                orderId: order._id,
            },
        });
    };

    return (
        <div className='bg-white p-4 rounded-md'>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-slate-600'>
                    My Orders{" "}
                </h2>
                <select
                    className='outline-none px-3 py-1 border rounded-md text-slate-600'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                >
                    <option value='all'>All</option>
                    <option value='placed'>Placed</option>
                    <option value='pending'>Pending</option>
                    <option value='cancelled'>Cancelled</option>
                </select>
            </div>

            <div className='pt-4'>
                <div className='relative overflow-x-auto rounded-md'>
                    <table className='w-full text-sm text-left text-gray-500'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
                            <tr>
                                <th scope='col' className='px-6 py-3'>
                                    Order Id
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                    Price
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                    Payment Status
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                    Order Status
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {myOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className='bg-white border-b'
                                >
                                    <td
                                        scope='row'
                                        className='px-6 py-4 font-medium whitespace-nowrap'
                                    >
                                        #{order._id}
                                    </td>
                                    <td
                                        scope='row'
                                        className='px-6 py-4 font-medium whitespace-nowrap'
                                    >
                                        {formatPrice(order.price)}
                                    </td>
                                    <td
                                        scope='row'
                                        className='px-6 py-4 font-medium whitespace-nowrap'
                                    >
                                        {order.payment_status}
                                    </td>
                                    <td
                                        scope='row'
                                        className='px-6 py-4 font-medium whitespace-nowrap'
                                    >
                                        {order.delivery_status}
                                    </td>
                                    <td
                                        scope='row'
                                        className='px-6 py-4 font-medium whitespace-nowrap'
                                    >
                                        <Link
                                            to={`/dashboard/order/details/${order._id}`}
                                        >
                                            <span className='bg-green-200 text-green-800 text-md font-semibold mr-2 px-3 py-[2px] rounded'>
                                                View
                                            </span>
                                        </Link>

                                        {order.payment_status !== "paid" && (
                                            <span
                                                onClick={() => redirect(order)}
                                                className='bg-green-200 text-green-800 text-md font-semibold mr-2 px-3 py-[2px] rounded'
                                            >
                                                Pay Now
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
