import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
    get_customers,
    get_messages_customer,
    messageClear,
    seller_send_message_to_customer,
    updateMessage,
} from "../../store/Reducers/chatReducer";
import { Link, useParams } from "react-router-dom";
import { socket } from "./../../utils/utils";
import { toast } from "react-hot-toast";
import { useRef } from "react";

const SellerToCustomer = () => {
    const [show, setShow] = useState(false);
    const [text, setText] = useState("");
    const sellerId = 65;
    const { userInfo } = useSelector((state) => state.auth);
    const [receiverMessage, setReceiverMessage] = useState("");

    const { customers, messages, currentCustomer, successMessage } =
        useSelector((state) => state.chat);

    const dispatch = useDispatch();

    const { customerId } = useParams();

    const scrollRef = useRef();

    useEffect(() => {
        dispatch(get_customers(userInfo._id));
    }, []);

    useEffect(() => {
        if (customerId) {
            dispatch(get_messages_customer(customerId));
        }
    }, [customerId]);

    useEffect(() => {
        if (successMessage) {
            socket.emit("send_seller_message", messages[messages.length - 1]);
            // messages[messages.length - 1] lấy phần tử cuối cùng trong mảng messages
            dispatch(messageClear());
        }
    }, [successMessage]);

    const send_message = (e) => {
        e.preventDefault();
        if (text) {
            dispatch(
                seller_send_message_to_customer({
                    senderId: userInfo._id,
                    text,
                    receiverId: customerId,
                    name: userInfo?.shopInfo?.shopName,
                })
            );
            setText("");
        }
    };

    useEffect(() => {
        socket.on("customer_message", (msg) => {
            setReceiverMessage(msg); //msg: ib tu seller
        });
    }, []);

    useEffect(() => {
        if (receiverMessage) {
            if (
                customerId === receiverMessage.senderId &&
                userInfo._id === receiverMessage.receiverId
            ) {
                dispatch(updateMessage(receiverMessage));
            } else {
                toast.success(
                    receiverMessage.senderName + " " + "Send A message"
                );
                dispatch(messageClear());
            }
        }
    }, [receiverMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="px-2 lg:px-7 py-5">
            <div className="w-full bg-primary px-4 py-4 rounded-md h-[calc(100vh-140px)]">
                <div className="flex w-full h-full relative">
                    <div
                        className={`w-[280px] h-full absolute z-10 ${
                            show ? "-left-[16px]" : "-left-[336px]"
                        } md:left-0 md:relative transition-all `}
                    >
                        <div className="w-full h-[calc(100vh-177px)] bg-[#ccc] md:bg-transparent overflow-y-auto">
                            <div className="flex text-xl justify-between items-center p-4 md:p-0 md:px-3 md:pb-3 text-white">
                                <h2>Customers</h2>
                                <span
                                    onClick={() => setShow(!show)}
                                    className="block cursor-pointer md:hidden"
                                >
                                    <IoMdClose />{" "}
                                </span>
                            </div>

                            {customers.map((c) => (
                                <Link
                                    key={c._id}
                                    to={`/seller/dashboard/chat-customer/${c.fdId}`}
                                    className={`h-[60px] flex justify-start gap-2 items-center text-white px-2 py-2 rounded-md cursor-pointer bg-[#ccc] `}
                                >
                                    <div className="relative">
                                        <img
                                            className="w-[38px] h-[38px] border-white border-2 max-w-[38px] p-[2px] rounded-full"
                                            src="http://localhost:3000/images/admin.jpg"
                                            alt=""
                                        />
                                        <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                    </div>

                                    <div className="flex justify-center items-start flex-col w-full">
                                        <div className="flex justify-between items-center w-full">
                                            <h2 className="text-[1.3rem] font-semibold text-black">
                                                {c.name}
                                            </h2>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-[calc(100%-200px)] md:pl-4">
                        <div className="flex justify-between items-center">
                            {sellerId && (
                                <div className="flex justify-start items-center gap-3">
                                    <div className="relative">
                                        <img
                                            className="w-[45px] h-[45px] border-green-500 border-2 max-w-[45px] p-[2px] rounded-full"
                                            src="http://localhost:3000/images/demo.jpg"
                                            alt=""
                                        />
                                        <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                    </div>
                                    <h2 className="text-base text-white font-semibold">
                                        {currentCustomer.name}
                                    </h2>
                                </div>
                            )}
                            <div
                                onClick={() => setShow(!show)}
                                className="w-[35px] flex md:hidden h-[35px] rounded-sm bg-blue-500 shadow-lg hover:shadow-blue-500/50 justify-center cursor-pointer items-center text-white"
                            >
                                <span>
                                    <FaList />{" "}
                                </span>
                            </div>
                        </div>
                        <div className="py-4">
                            <div className="bg-[#475569] h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto">
                                {customerId ? (
                                    messages.map((m, i) => {
                                        if (m.senderId === customerId) {
                                            return (
                                                <div
                                                    ref={scrollRef}
                                                    className="w-full flex justify-start items-center"
                                                >
                                                    <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                                                        <div>
                                                            <img
                                                                className="w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]"
                                                                src="http://localhost:3001/images/demo.jpg"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="flex justify-center items-start flex-col w-full bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-1 px-2 rounded-sm">
                                                            <span>
                                                                {m.message}{" "}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="w-full flex justify-end items-center">
                                                    <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                                                        <div className="flex justify-center items-start flex-col w-full bg-red-500 shadow-lg shadow-red-500/50 text-white py-1 px-2 rounded-sm">
                                                            <span>
                                                                {m.message}{" "}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <img
                                                                className="w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]"
                                                                src="http://localhost:3001/images/admin.jpg"
                                                                alt=""
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })
                                ) : (
                                    <div className="w-full h-full flex justify-center items-center text-white gap-2 flex-col">
                                        <span>Select Customer </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <form onSubmit={send_message} className="flex gap-3">
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full flex justify-between px-2 border border-slate-700 items-center py-[5px] focus:border-blue-500 rounded-md outline-none bg-transparent text-[#d0d2d6]"
                                type="text"
                                placeholder="Input Your Message"
                            />
                            <button className="shadow-lg bg-[#06b6d4] hover:shadow-cyan-500/50 text-semibold w-[75px] h-[35px] rounded-md text-white flex justify-center items-center">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SellerToCustomer;