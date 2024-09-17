import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_banner = createAsyncThunk(
    "auth/add_banner",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/add-banner", info, {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_banners = createAsyncThunk(
    "auth/get_banners",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get("/get-banners", {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const banner_update_status = createAsyncThunk(
    "admin/banner_update_status",
    async ({ bannerId, info }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(
                `/banner-status/update/${bannerId}`,
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

export const delete_banner = createAsyncThunk(
    "admin/delete_banner",
    async (bannerId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(
                `/delete_banner/${bannerId}`,

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

export const bannerReducer = createSlice({
    name: "banner",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        banners: [],
        banner: "",
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_banner.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(add_banner.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(add_banner.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.banner = payload.banner;
            })
            .addCase(get_banners.pending, (state) => {
                state.loader = false;
            })
            .addCase(get_banners.rejected, (state, { payload }) => {
                state.loader = false;
            })
            .addCase(get_banners.fulfilled, (state, { payload }) => {
                state.banners = payload.banners;
            })
            .addCase(banner_update_status.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })
            .addCase(delete_banner.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            });
    },
});

export const { messageClear } = bannerReducer.actions;
export default bannerReducer.reducer;
