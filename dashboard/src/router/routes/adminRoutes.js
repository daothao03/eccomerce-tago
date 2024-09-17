import { lazy } from "react";

const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const ChatSeller = lazy(() => import("../../views/admin/ChatSeller"));
const SellerDetails = lazy(() => import("../../views/admin/SellerDetails"));
const SellerRequest = lazy(() => import("../../views/admin/SellerRequest"));
const Orders = lazy(() => import("../../views/admin/Orders"));
const Category = lazy(() => import("../../views/admin/Category"));
const Sellers = lazy(() => import("../../views/admin/Sellers"));
const PaymentRequest = lazy(() => import("../../views/admin/PaymentRequest"));
const DeactiveSellers = lazy(() => import("../../views/admin/DeactiveSellers"));
const AddBanner = lazy(() => import("../../views/admin/AddBanner"));
const OrderDetails = lazy(() => import("../../views/admin/OrderDetails"));

export const adminRoutes = [
    {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
        role: "admin",
    },
    {
        path: "/admin/dashboard/orders",
        element: <Orders />,
        role: "admin",
    },
    {
        path: "/admin/dashboard/category",
        element: <Category />,
        role: "admin",
    },
    {
        path: "/admin/dashboard/sellers",
        element: <Sellers />,
        role: "admin",
    },
    {
        path: "/admin/dashboard/payment-request",
        element: <PaymentRequest />,
        role: "admin",
    },
    {
        path: "/admin/dashboard/deactive-sellers",
        element: <DeactiveSellers />,
        role: "admin",
    },
    {
        path: "/admin/dashboard/sellers-request",
        element: <SellerRequest />,
        role: "admin",
    },
    {
        path: "admin/dashboard/seller/details/:sellerId",
        element: <SellerDetails />,
        role: "admin",
    },
    {
        path: "admin/dashboard/chat-seller",
        element: <ChatSeller />,
        role: "admin",
    },
    {
        path: "admin/dashboard/chat-seller/:sellerId",
        element: <ChatSeller />,
        role: "admin",
    },
    {
        path: "admin/dashboard/order/details/:orderId",
        element: <OrderDetails />,
        role: "admin",
    },
    {
        path: "admin/dashboard/add-banner",
        element: <AddBanner />,
        role: "admin",
    },
];