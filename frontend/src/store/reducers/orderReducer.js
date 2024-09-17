import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const place_order = createAsyncThunk(
    "order/place_order",
    async ({
        price,
        products,
        shipping_fee,
        items,
        shippingInfo,
        userId,
        navigate,
    }) => {
        try {
            const { data } = await api.post("/home/order/place-order", {
                price,
                products,
                shipping_fee,
                items,
                shippingInfo,
                userId,
                navigate,
            });
            console.log(data);
            navigate("/payment", {
                state: {
                    price: price + shipping_fee,
                    items,
                    orderId: data.orderId,
                },
            });
        } catch (error) {
            console.log(error.response);
        }
    }
);

export const get_orders = createAsyncThunk(
    "order/get_orders",
    async ({ customerId, status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/home/customer/get-orders/${customerId}/${status}`
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const get_order_detail = createAsyncThunk(
    "order/get_order_detail",
    async (orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/home/customer/get-order-detail/${orderId}`
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const orderReducer = createSlice({
    name: "order",
    initialState: {
        myOrders: [],
        errorMessage: "",
        successMessage: "",
        loader: false,
        myOrder: {},
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder.addCase(get_orders.fulfilled, (state, { payload }) => {
            state.myOrders = payload.orders;
        });
        builder.addCase(get_order_detail.fulfilled, (state, { payload }) => {
            state.myOrder = payload.order;
        });
    },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;