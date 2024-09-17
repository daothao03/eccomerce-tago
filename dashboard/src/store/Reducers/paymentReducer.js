import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_seller_payment_details = createAsyncThunk(
    "payment/get_seller_payment_details",
    async (sellerId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/payment/get-seller-payment-details/${sellerId}`,
                {
                    withCredentials: true,
                }
            );
            console.log("Data: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const seller_send_request_withdraw = createAsyncThunk(
    "payment/seller_send_request_withdraw",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(
                `/payment/seller-send-request-withdraw`,
                info,
                {
                    withCredentials: true,
                }
            );
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_request_payment = createAsyncThunk(
    "payment/get_request_payment",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/payment/get-request-payment`, {
                withCredentials: true,
            });
            console.log("Data: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const confirm_payment_request = createAsyncThunk(
    "payment/confirm_payment_request",
    async (paymentId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(
                `/payment/confirm-payment-request`,
                { paymentId },
                {
                    withCredentials: true,
                }
            );
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const paymentReducer = createSlice({
    name: "payment",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        pendingWithdraws: [],
        successWithdraws: [],
        totalAmount: 0,
        withdrawAmount: 0,
        pendingAmount: 0,
        availableAmount: 0,
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            //GET request

            .addCase(
                get_seller_payment_details.fulfilled,
                (state, { payload }) => {
                    state.pendingWithdraws = payload.pendingWithdraws;
                    state.successWithdraws = payload.successWithdraws;
                    state.totalAmount = payload.totalAmount;
                    state.pendingAmount = payload.pendingAmount;
                    state.withdrawAmount = payload.withdrawAmount;
                    state.availableAmount = payload.availableAmount;
                }
            )
            .addCase(
                seller_send_request_withdraw.pending,
                (state, { payload }) => {
                    state.loader = true;
                }
            )
            .addCase(
                seller_send_request_withdraw.rejected,
                (state, { payload }) => {
                    state.loader = false;
                    state.errorMessage = payload.message;
                }
            )
            .addCase(
                seller_send_request_withdraw.fulfilled,
                (state, { payload }) => {
                    state.loader = false;
                    state.successMessage = payload.message;
                    state.pendingWithdraws = [
                        ...state.pendingWithdraws,
                        payload.withdraw,
                    ];
                    state.availableAmount =
                        state.availableAmount - payload.withdraw.amount;
                    state.pendingAmount = payload.withdraw.amount;
                }
            )
            .addCase(get_request_payment.fulfilled, (state, { payload }) => {
                state.pendingWithdraws = payload.pendingWithdrawsRequest;
            })
            .addCase(confirm_payment_request.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(confirm_payment_request.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(
                confirm_payment_request.fulfilled,
                (state, { payload }) => {
                    const temp = state.pendingWithdraws.filter(
                        (r) => r._id !== payload.payment._id
                    );
                    state.loader = false;
                    state.successMessage = payload.message;
                    state.pendingWithdraws = temp;
                }
            );
    },
});

export const { messageClear } = paymentReducer.actions;
export default paymentReducer.reducer;
