import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_data_dashboard = createAsyncThunk(
    "dashboard/get_data_dashboard",
    async (userId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/home/customer/get-data-dashboard/${userId}`
            );
            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const dashboardReducer = createSlice({
    name: "dashboard",
    initialState: {
        recentOrders: [],
        errorMessage: "",
        successMessage: "",
        pendingOrder: 0,
        cancelledOrder: 0,
        totalOrder: 0,
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // .addCase(customer_register.pending, (state, { payload }) => {
            //     state.loader = true;
            // })
            // .addCase(customer_register.rejected, (state, { payload }) => {
            //     state.errorMessage = payload.error;
            //     state.loader = false;
            // })
            .addCase(get_data_dashboard.fulfilled, (state, { payload }) => {
                state.recentOrders = payload.recentOrders;
                state.pendingOrder = payload.pendingOrder;
                state.cancelledOrder = payload.cancelledOrder;
                state.totalOrder = payload.totalOrder;
            });
    },
});

export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;
