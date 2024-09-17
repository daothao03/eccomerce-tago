import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Card from "./pages/Card";
import Shipping from "./pages/Shipping";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { get_category } from "./store/reducers/homeReducer";
import CategoryShop from "./pages/CategoryShop";
import Payment from "./pages/Payment";
import ProtectUser from "./utils/ProtectUser";
import Dashboard from "./pages/Dashboard";
import Index from "./components/dashboard/Index";
import Orders from "./components/dashboard/Orders";
import ChangePassword from "./components/dashboard/ChangePassword";
import Wishlist from "./components/dashboard/Wishlist";
import OrderDetails from "./components/dashboard/OrderDetails";
import Chat from "./components/dashboard/Chat";
import ConfirmOrder from "./pages/ConfirmOrder";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(get_category());
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/card" element={<Card />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/product/details/:slug" element={<Details />} />

                <Route path="/order/confirm?" element={<ConfirmOrder />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products?" element={<CategoryShop />} />
                <Route path="/dashboard" element={<ProtectUser />}>
                    <Route path="" element={<Dashboard />}>
                        <Route path="" element={<Index />} />
                        <Route path="my-orders" element={<Orders />} />
                        <Route
                            path="change-password"
                            element={<ChangePassword />}
                        />
                        <Route path="my-wishlist" element={<Wishlist />} />
                        <Route
                            path="order/details/:orderId"
                            element={<OrderDetails />}
                        />
                        <Route path="chat" element={<Chat />} />
                        <Route path="chat/:sellerId" element={<Chat />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
