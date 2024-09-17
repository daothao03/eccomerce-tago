import React, { forwardRef, useEffect, useState } from "react";
import { MdCurrencyExchange } from "react-icons/md";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import {
    get_seller_payment_details,
    messageClear,
    seller_send_request_withdraw,
} from "../../store/Reducers/paymentReducer";
import { formatPrice } from "../../utils/utils";
import toast from "react-hot-toast";
import moment from "moment";

function handleOnWheel({ deltaY }) {
    console.log("handleOnWheel", deltaY);
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
));

const Payments = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const {
        pendingWithdraws,
        successWithdraws,
        totalAmount,
        withdrawAmount,
        pendingAmount,
        availableAmount,
        loader,
        successMessage,
        errorMessage,
    } = useSelector((state) => state.payment);

    const [amount, setAmount] = useState(0);

    useEffect(() => {
        dispatch(get_seller_payment_details(userInfo._id));
    }, []);

    const send_request = (e) => {
        e.preventDefault();

        if (totalAmount - amount > 10) {
            dispatch(
                seller_send_request_withdraw({
                    sellerId: userInfo._id,
                    amount,
                })
            );
            setAmount(0);
        } else {
            toast.error("Insufficient Balance");
        }
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

    const Row = ({ index, style }) => {
        return (
            <div
                style={style}
                className="flex text-[1.2rem] text-white font-medium"
            >
                <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    {formatPrice(pendingWithdraws[index]?.amount)}
                </div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    <span className="py-[1px] px-[5px] bg-slate-300 text-blue-500 rounded-md text-[1.2rem]">
                        {pendingWithdraws[index]?.status}
                    </span>
                </div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    {moment(pendingWithdraws[index]?.createdAt).format("LL")}
                </div>
            </div>
        );
    };

    const Rows = ({ index, style }) => {
        return (
            <div
                style={style}
                className="flex text-[1.2rem] text-white font-medium"
            >
                <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    {formatPrice(successWithdraws[index]?.amount)}
                </div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    <span className="py-[1px] px-[5px] bg-slate-300 text-blue-500 rounded-md text-[1.2rem]">
                        {successWithdraws[index]?.status}
                    </span>
                </div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    {moment(successWithdraws[index]?.createdAt).format("LL")}
                </div>
            </div>
        );
    };

    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-5">
                <div className="flex justify-between items-center p-5 bg-[#fae8e8] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#5c5a5a]">
                        <h2 className="text-[1.8rem] font-[800] text-black">
                            {formatPrice(totalAmount)}
                        </h2>
                        <span className="text-[1.2rem] font-bold">
                            Total Sales
                        </span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#fa0305] flex justify-center items-center text-xl">
                        <MdCurrencyExchange className="text-[#fae8e8] shadow-lg" />
                    </div>
                </div>
                <div className="flex justify-between items-center p-5 bg-[#fde2ff] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#5c5a5a]">
                        <h2 className="text-[1.8rem] font-[800] text-black">
                            {formatPrice(availableAmount)}
                        </h2>
                        <span className="text-[1.2rem] font-bold">
                            Available Amount
                        </span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#760077] flex justify-center items-center text-xl">
                        <MdCurrencyExchange className="text-[#fae8e8] shadow-lg" />
                    </div>
                </div>
                <div className="flex justify-between items-center p-5 bg-[#e9feea] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#5c5a5a]">
                        <h2 className="text-[1.8rem] font-[800] text-black">
                            {formatPrice(withdrawAmount)}
                        </h2>
                        <span className="text-[1.2rem] font-bold">
                            WithDrawal Amount
                        </span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#038000] flex justify-center items-center text-xl">
                        <MdCurrencyExchange className="text-[#fae8e8] shadow-lg" />
                    </div>
                </div>
                <div className="flex justify-between items-center p-5 bg-[#ecebff] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#5c5a5a]">
                        <h2 className="text-[1.8rem] font-[800] text-black">
                            {formatPrice(pendingAmount)}
                        </h2>
                        <span className="text-[1.2rem] font-bold">
                            Pending Amount
                        </span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#0200f8] flex justify-center items-center text-xl">
                        <MdCurrencyExchange className="text-[#fae8e8] shadow-lg" />
                    </div>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 pb-4">
                <div className="bg-primary text-[#d0d2d6] rounded-md p-5">
                    <h2 className="text-[2rem]">Send Request</h2>
                    <div className="pt-5 mb-5">
                        <form onSubmit={send_request}>
                            <div className="flex gap-3 flex-wrap">
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="0"
                                    type="number"
                                    className="px-3 py-2 md:w-[75%] focus:border-indigo-200 outline-none bg-primary border border-slate-700 rounded-md text-[#d0d2d6]"
                                    name="amount"
                                    placeholder="Request..."
                                />
                                <button
                                    disabled={loader}
                                    className="bg-red-500  hover:shadow-red-500/40 hover:shadow-md text-white rounded-md px-7 py-2"
                                >
                                    {loader ? "Loading.." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div>
                        <h2 className="text-[2rem] pb-4">Pending Request </h2>
                        <div className="w-full overflow-x-auto">
                            <div className="flex bg-[#a7a3de] uppercase text-[1.3rem] font-bold min-w-[340px] rounded-md">
                                <div className="w-[25%] p-2"> No </div>
                                <div className="w-[25%] p-2"> Amount </div>
                                <div className="w-[25%] p-2"> Status </div>
                                <div className="w-[25%] p-2"> Date </div>
                            </div>
                            {
                                <List
                                    style={{ minWidth: "340px" }}
                                    className="List"
                                    height={350}
                                    itemCount={pendingWithdraws.length}
                                    itemSize={35}
                                    outerElementType={outerElementType}
                                >
                                    {Row}
                                </List>
                            }
                        </div>
                    </div>
                </div>
                <div className="bg-primary text-[#d0d2d6] rounded-md p-5">
                    <div>
                        <h2 className="text-[2rem] pb-4">
                            Success WithDrawal{" "}
                        </h2>

                        <div className="w-full overflow-x-auto">
                            <div className="flex bg-[#a7a3de] uppercase text-[1.3rem] font-bold min-w-[340px] rounded-md">
                                <div className="w-[25%] p-2"> No </div>
                                <div className="w-[25%] p-2"> Amount </div>
                                <div className="w-[25%] p-2"> Status </div>
                                <div className="w-[25%] p-2"> Date </div>
                            </div>
                            {
                                <List
                                    style={{ minWidth: "340px" }}
                                    className="List"
                                    height={350}
                                    itemCount={successWithdraws.length}
                                    itemSize={35}
                                    outerElementType={outerElementType}
                                >
                                    {Rows}
                                </List>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Payments;
