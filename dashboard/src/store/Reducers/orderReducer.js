import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_admin_orders = createAsyncThunk(
    "admin/get_admin_orders",
    async (
        { parPage, page, searchValue },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/admin/get-admin-orders?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
                {
                    withCredentials: true,
                }
            );
            // console.log("Data category: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_admin_order = createAsyncThunk(
    "admin/get_admin_order",
    async (orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/admin/get-admin-order/${orderId}`,
                {
                    withCredentials: true,
                }
            );
            // console.log("Data category: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const order_update_status = createAsyncThunk(
    "admin/order_update_status",
    async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(
                `/admin/order-status/update/${orderId}`,
                info,
                {
                    withCredentials: true,
                }
            );
            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_seller_orders = createAsyncThunk(
    "seller/get_seller_orders",
    async (
        { parPage, page, searchValue, sellerId },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/seller/get-seller-orders/${sellerId}?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
                {
                    withCredentials: true,
                }
            );
            // console.log("Data category: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_seller_order = createAsyncThunk(
    "orders/get_seller_order",
    async (orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/seller/order/${orderId}`, {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const seller_order_status_update = createAsyncThunk(
    "orders/seller_order_status_update",
    async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(
                `/seller/order-status/update/${orderId}`,
                info,
                { withCredentials: true }
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
        successMessage: "",
        errorMessage: "",
        loader: false,
        orders: [],
        order: {},
        totalOrder: 0,
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_admin_orders.fulfilled, (state, { payload }) => {
                state.totalOrder = payload.totalOrder;
                state.orders = payload.orders;
            })
            .addCase(get_admin_order.fulfilled, (state, { payload }) => {
                state.order = payload.order;
            })
            .addCase(order_update_status.rejected, (state, { payload }) => {
                state.errorMessage = payload.message;
            })
            .addCase(order_update_status.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })
            .addCase(get_seller_orders.fulfilled, (state, { payload }) => {
                state.totalOrder = payload.totalOrder;
                state.orders = payload.orders;
            })
            .addCase(get_seller_order.fulfilled, (state, { payload }) => {
                state.order = payload.order;
            })
            .addCase(
                seller_order_status_update.rejected,
                (state, { payload }) => {
                    state.errorMessage = payload.message;
                }
            )
            .addCase(
                seller_order_status_update.fulfilled,
                (state, { payload }) => {
                    state.successMessage = payload.message;
                }
            );
    },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
