import { BsCurrencyDollar } from "react-icons/bs";
import { FaHornbill, FaProductHunt, FaSellcast } from "react-icons/fa";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { get_seller_dashboard_data } from "../../store/Reducers/dashboardReducer";
import { formatPrice } from "../../utils/utils";
import moment from "moment";
import customer from "../../asset/success.png";

const SellerDashboard = () => {
    const dispatch = useDispatch();

    const {
        totalSale,
        totalOrder,
        totalProduct,
        totalPendingOrder,
        recentOrders,
        recentMessages,
        monthlyRevenue,
    } = useSelector((state) => state.dashboard);

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(get_seller_dashboard_data());
    }, []);

    const state = {
        series: [
            {
                name: "Orders",
                data: monthlyRevenue.map((item) => item.totalOrders),
            },
            {
                name: "Revenue",
                data: monthlyRevenue.map((item) => item.totalRevenue),
            },
        ],
        options: {
            color: ["#181ee8", "#181ee8"],
            plotOptions: {
                radius: 30,
            },
            chart: {
                background: "transparent",
                foreColor: "#d0d2d6",
            },
            dataLabels: {
                enabled: false,
            },
            strock: {
                show: true,
                curve: ["smooth", "straight", "stepline"],
                lineCap: "butt",
                colors: "#f0f0f0",
                width: 0.5,
                dashArray: 0,
            },
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apl",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
            },
            yaxis: [
                {
                    title: {
                        text: "Orders",
                    },

                    labels: {
                        formatter: function (value) {
                            return value;
                        },
                    },
                },
                {
                    opposite: true,
                    title: {
                        text: "Revenue",
                    },

                    labels: {
                        formatter: function (value) {
                            return value;
                        },
                    },
                },
            ],
            legend: {
                position: "top",
            },
            responsive: [
                {
                    breakpoint: 565,
                    yaxis: {
                        categories: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apl",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                        ],
                    },
                    options: {
                        plotOptions: {
                            bar: {
                                horizontal: true,
                            },
                        },
                        chart: {
                            height: "550px",
                        },
                    },
                },
            ],
        },
    };

    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 text-white">
                <div className="justify-between rounded-md gap-3 flex items-center p-5 bg-[#74c69d]">
                    <div className="flex flex-col justify-start items-start ">
                        <h2 className="text-3xl font-bold">
                            {formatPrice(totalSale)}
                        </h2>
                        <span className="text-md font-medium">Total Sales</span>
                    </div>

                    <div className="w-[40px] h-[47px] rounded-full bg-[#d8f3dc] flex justify-center items-center text-xl">
                        <BsCurrencyDollar className="text-[#000] text-[2rem] shadow-lg" />
                    </div>
                </div>

                <div className="justify-between rounded-md gap-3 flex items-center p-5 bg-[#40916c]">
                    <div className="flex flex-col justify-start items-start ">
                        <h2 className="text-3xl font-bold">{totalProduct}</h2>
                        <span className="text-md font-medium">Products</span>
                    </div>

                    <div className="w-[40px] h-[47px] rounded-full bg-[#d8f3dc] flex justify-center items-center text-xl">
                        <FaProductHunt className="text-[#000] text-[2rem] shadow-lg" />
                    </div>
                </div>

                <div className="justify-between rounded-md gap-3 flex items-center p-5 bg-[#2d6a4f]">
                    <div className="flex flex-col justify-start items-start ">
                        <h2 className="text-3xl font-bold">{totalOrder}</h2>
                        <span className="text-md font-medium">Orders</span>
                    </div>

                    <div className="w-[40px] h-[47px] rounded-full bg-[#d8f3dc] flex justify-center items-center text-xl">
                        <FaSellcast className="text-[#000] text-[2rem] shadow-lg" />
                    </div>
                </div>

                <div className="justify-between rounded-md gap-3 flex items-center p-5 bg-[#1b4332]">
                    <div className="flex flex-col justify-start items-start ">
                        <h2 className="text-3xl font-bold">
                            {totalPendingOrder}
                        </h2>
                        <span className="text-md font-medium">
                            Pending Orders
                        </span>
                    </div>

                    <div className="w-[40px] h-[47px] rounded-full bg-[#d8f3dc] flex justify-center items-center text-xl">
                        <FaHornbill className=" text-[2rem] shadow-lg text-[#000]" />
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-wrap mt-7 ">
                <div className="w-full lg:w-7/12 lg:pr-3 ">
                    <div className="w-full bg-primary p-4 rounded-md">
                        <Chart
                            options={state.options}
                            series={state.series}
                            type="bar"
                            height={"350px"}
                        />
                    </div>
                </div>

                <div className="w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0">
                    <div className="w-full bg-primary p-4 rounded-md text-[#fff]">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold pb-3 text-[1.9rem] text-[#fff]">
                                Recent Customer Message
                            </h2>
                            <Link className="font-semibold text-[1.3rem] text-[#fff]">
                                View All
                            </Link>
                        </div>

                        <div className="flex flex-col gap-2 pt-6 text-[#fff] ">
                            <ol className="relative border-1 border-slate-600 ml-4">
                                {recentMessages.map((m, i) => (
                                    <li key={m._id} className="mb-[30px] ml-6">
                                        <div className="flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#4c7fe2] rounded-full z-10">
                                            {m.senderId === userInfo._id ? (
                                                <img
                                                    className="w-full rounded-full h-full shadow-lg"
                                                    src={userInfo.image}
                                                    alt=""
                                                />
                                            ) : (
                                                <img
                                                    className="w-full rounded-full h-full shadow-lg"
                                                    src={customer}
                                                    alt=""
                                                />
                                            )}
                                        </div>
                                        <div className="p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <Link className="text-md font-normal">
                                                    {m.senderName}
                                                </Link>
                                                <time className="mb-1 text-sm font-normal sm:order-last sm:mb-0">
                                                    {moment(m.createdAt)
                                                        .startOf("hour")
                                                        .fromNow()}
                                                </time>
                                            </div>
                                            <div className="p-2 text-[1.2rem] font-normal bg-slate-700 rounded-lg border border-slate-800">
                                                {m.message}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full p-4 bg-primary rounded-md mt-6">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-[1.9rem] text-[#fff] pb-3">
                        Recent Orders
                    </h2>
                    <Link className="font-semibold text-[1.3rem] text-[#fff]">
                        View All
                    </Link>
                </div>
                <div className="relative overflow-x-auto ">
                    <table className="w-full text-left text-[1.3rem] text-white  ">
                        <thead className="border-slate-700 uppercase border-b text-[1.3rem] ">
                            <tr>
                                <th scope="col" className="py-3 px-4">
                                    Order ID
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Price
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Payment Status
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Order Status
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Active
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((d, i) => (
                                <tr key={d._id}>
                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap"
                                    >
                                        #{d._id}
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap"
                                    >
                                        {formatPrice(d.price)}
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap"
                                    >
                                        {d.payment_status}
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap"
                                    >
                                        {d.delivery_status}
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-3 px-4 font-medium whitespace-nowrap"
                                    >
                                        <Link
                                            to={`/seller/dashboard/order/details/${d._id}`}
                                        >
                                            View
                                        </Link>
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

export default SellerDashboard;
