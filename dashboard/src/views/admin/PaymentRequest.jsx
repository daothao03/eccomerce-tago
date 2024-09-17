import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window";
import {
    confirm_payment_request,
    get_request_payment,
    messageClear,
} from "../../store/Reducers/paymentReducer";
import { formatPrice } from "../../utils/utils";
import moment from "moment";
import toast from "react-hot-toast";

function handleOnWheel({ deltaY }) {
    console.log("handle", deltaY);
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
));

const PaymentRequest = () => {
    const dispatch = useDispatch();
    const { successMessage, errorMessage, loader, pendingWithdraws } =
        useSelector((state) => state.payment);

    const [paymentId, setPaymentId] = useState("");

    useEffect(() => {
        dispatch(get_request_payment());
    }, []);

    const confirm_request = (id) => {
        setPaymentId(id);

        dispatch(confirm_payment_request(id));
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
                <div className="w-[15%] p-2 whitespace-nowrap">{index + 1}</div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    {" "}
                    {pendingWithdraws[index]?.sellerId}
                </div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    {formatPrice(pendingWithdraws[index]?.amount)}
                </div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    <span className="py-[1px] px-[9px] rounded-999 bg-slate-300 text-blue-500 ">
                        {pendingWithdraws[index]?.status}
                    </span>
                </div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    {moment(pendingWithdraws[index]?.createdAt).format("LL")}
                </div>
                <div className="w-[25%] p-2 whitespace-nowrap">
                    <button
                        disabled={loader}
                        onClick={() =>
                            confirm_request(pendingWithdraws[index]?._id)
                        }
                        className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-3 py-[2px] cursor-pointer text-white rounded-999"
                    >
                        {loader && paymentId === pendingWithdraws[index]?._id
                            ? "Loading...."
                            : "Confirm"}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-primary rounded-md">
                <h2 className="text-[1.7rem] font-medium pb-5 text-white">
                    Dao Thao Request
                </h2>
                <div className="w-full">
                    <div className="w-full overflow-x-auto">
                        <div className="flex rounded-lg bg-[#a7a3de] uppercase font-semibold  text-[1.3rem] min-w-[340px]">
                            <div className="w-[15%] p-2">No</div>
                            <div className="w-[25%] p-2">SellerID</div>
                            <div className="w-[25%] p-2">Amount</div>
                            <div className="w-[25%] p-2">Status</div>
                            <div className="w-[25%] p-2">Date</div>
                            <div className="w-[25%] p-2">Action</div>
                        </div>

                        {
                            <List
                                style={{ minWidth: "340px" }}
                                className="List"
                                height={520}
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
        </div>
    );
};

export default PaymentRequest;
