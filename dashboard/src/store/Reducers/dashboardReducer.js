import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_admin_dashboard_data = createAsyncThunk(
    "dashboard/get_admin_dashboard_data",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/admin/get-admin-dashboard-data`, {
                withCredentials: true,
            });
            // console.log("Data category: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_seller_dashboard_data = createAsyncThunk(
    "dashboard/get_seller_dashboard_data",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/admin/get-seller-dashboard-data`, {
                withCredentials: true,
            });
            // console.log("Data category: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const dashboardReducer = createSlice({
    name: "dashboard",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        totalSale: 0,
        totalProduct: 0,
        totalSeller: 0,
        totalOrder: 0,
        recentOrders: [],
        recentMessages: [],
        totalPendingOrder: 0,
        monthlyRevenue: [],
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                get_admin_dashboard_data.fulfilled,
                (state, { payload }) => {
                    state.totalSale = payload.totalSale;
                    state.totalProduct = payload.totalProduct;
                    state.totalOrder = payload.totalOrder;
                    state.totalSeller = payload.totalSeller;
                    state.recentMessages = payload.recentMessages;
                    state.recentOrders = payload.recentOrders;
                }
            )
            .addCase(
                get_seller_dashboard_data.fulfilled,
                (state, { payload }) => {
                    state.totalSale = payload.totalSale;
                    state.totalOrder = payload.totalOrder;
                    state.totalProduct = payload.totalProduct;
                    state.totalPendingOrder = payload.totalPendingOrder;
                    state.recentOrders = payload.recentOrders;
                    state.recentMessages = payload.messages;
                    state.monthlyRevenue = payload.monthlyData;
                }
            );
    },
});

export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;
