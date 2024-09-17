import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    get_seller_order,
    messageClear,
    seller_order_status_update,
} from "../../store/Reducers/orderReducer";
import { formatPrice } from "../../utils/utils";
import toast from "react-hot-toast";

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const { order, errorMessage, successMessage } = useSelector(
        (state) => state.order
    );

    useEffect(() => {
        dispatch(get_seller_order(orderId));
    }, [orderId]);

    const [status, setStatus] = useState("");

    useEffect(() => {
        setStatus(order?.delivery_status);
    }, [order]);

    const status_update = (e) => {
        dispatch(
            seller_order_status_update({
                orderId,
                info: { status: e.target.value },
            })
        );
        setStatus(e.target.value);
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
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-primary rounded-md">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-[2rem] text-[#d0d2d6]">
                        Order Details
                    </h2>
                    <select
                        onChange={status_update}
                        value={status}
                        name=""
                        id=""
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#475569] border border-slate-700 rounded-md text-[#d0d2d6]"
                    >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="placed">placed</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div>

                <div className="p-4">
                    <div className="flex gap-2 text-[1.6rem] text-[#d0d2d6]">
                        <h2>#{order._id}</h2>
                        <span>{order.date}</span>
                    </div>

                    <div className="flex flex-wrap">
                        <div className="w-[30%]">
                            <div className="pr-3 text-[#d0d2d6] text-[1.6rem]">
                                <div className="flex flex-col gap-1">
                                    <h2 className="pb-2 font-semibold">
                                        Deliver To : {order.shippingInfo?.name}{" "}
                                        - {order.shippingInfo?.address},{" "}
                                        {order.shippingInfo?.province},{" "}
                                        {order.shippingInfo?.city}
                                    </h2>
                                </div>
                                <div className="flex justify-start items-center gap-3">
                                    <h2>Payment Status: </h2>
                                    <span className="text-[1.6rem]">
                                        {order.payment_status}
                                    </span>
                                </div>
                                <span>Price : {formatPrice(order.price)}</span>

                                <div className="mt-4 flex flex-col gap-4 bg-[#283618] rounded-md">
                                    <div className="text-[#d0d2d6]">
                                        {order?.products?.map((p, i) => (
                                            <div className="flex gap-3 text-md items-center">
                                                <img
                                                    className="w-[90px] h-[90px] object-contain"
                                                    src={p.images[0]}
                                                    alt=""
                                                />

                                                <div>
                                                    <h2 className="line-clamp-1">
                                                        {p.name}{" "}
                                                    </h2>
                                                    <p>
                                                        <span>
                                                            Brand : {p.brand}
                                                        </span>
                                                        <span className="ml-3 inline-block text-lg">
                                                            Quantity :{" "}
                                                            {p.quantity}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
