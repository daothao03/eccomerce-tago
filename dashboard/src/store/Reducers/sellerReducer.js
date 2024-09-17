import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

//GET request :all
export const get_sellers_request = createAsyncThunk(
    "seller/get_sellers_request",
    async (
        { parPage, page, searchValue },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/get-sellers-request?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
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

//GET :id
export const get_seller = createAsyncThunk(
    "seller/get_seller",
    async (sellerId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-seller/${sellerId}`, {
                withCredentials: true,
            });
            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data);
        }
    }

    //UPDATE status
);

//UPDATE status
export const seller_update_status = createAsyncThunk(
    "seller/seller_update_status",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/update-status-seller`, info, {
                withCredentials: true,
            });
            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_active_sellers = createAsyncThunk(
    "seller/get_active_sellers",
    async (
        { parPage, page, searchValue },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/get-active-seller?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
                {
                    withCredentials: true,
                }
            );
            // console.log("Data active seller: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_deactive_sellers = createAsyncThunk(
    "seller/get_deactive_sellers",
    async (
        { parPage, page, searchValue },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/get-deactive-seller?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
                {
                    withCredentials: true,
                }
            );
            // console.log("Data active seller: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const create_momo_connect_account = createAsyncThunk(
    "payment/create_momo_connect_account",
    async () => {
        try {
            const {
                data: { url },
            } = await api.get(`/payment/create-momo-connect-account`, {
                withCredentials: true,
            });
            // return data;

            window.location.href = url;
            // console.log("Data active seller: ", data);
        } catch (error) {
            console.log(error.response.data);
        }
    }
);

export const active_stripe_connect_account = createAsyncThunk(
    "payment/active_stripe_connect_account",
    async (activeCode, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(
                `/payment/active-stripe-connect-account/${activeCode}`,
                {},
                {
                    withCredentials: true,
                }
            );
            // return data;
            return fulfillWithValue(data);
            // console.log("Data actsive seller: ", data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const sellerReducer = createSlice({
    name: "seller",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        sellers: [],
        seller: "",
        totalSeller: 0,
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            //GET request
            .addCase(get_sellers_request.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(get_sellers_request.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(get_sellers_request.fulfilled, (state, { payload }) => {
                state.totalSeller = payload.totalSeller;
                state.sellers = payload.sellers;
            })

            //GET :id
            .addCase(get_seller.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(get_seller.fulfilled, (state, { payload }) => {
                state.seller = payload.seller;
            })

            //UPDATE status
            .addCase(seller_update_status.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(seller_update_status.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_update_status.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.seller = payload.seller;
            })
            .addCase(get_active_sellers.fulfilled, (state, { payload }) => {
                state.totalSeller = payload.totalSeller;
                state.sellers = payload.sellers;
            })
            .addCase(get_deactive_sellers.fulfilled, (state, { payload }) => {
                state.totalSeller = payload.totalSeller;
                state.sellers = payload.sellers;
            })

            .addCase(
                active_stripe_connect_account.pending,
                (state, { payload }) => {
                    state.loader = true;
                }
            )
            .addCase(
                active_stripe_connect_account.rejected,
                (state, { payload }) => {
                    state.loader = false;
                    state.errorMessage = payload.message;
                }
            )
            .addCase(
                active_stripe_connect_account.fulfilled,
                (state, { payload }) => {
                    state.loader = false;
                    state.successMessage = payload.message;
                }
            );
    },
});

export const { messageClear } = sellerReducer.actions;
export default sellerReducer.reducer;
