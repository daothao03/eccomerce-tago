import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

export const admin_login = createAsyncThunk(
    "auth/admin_login",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        // console.log(info);
        // rejectWithValue, fulfillWithValue => createAsyncThunk
        try {
            const { data } = await api.post("/admin-login", info, {
                withCredentials: true,
            });
            localStorage.setItem("accessToken", data.token);
            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const seller_register = createAsyncThunk(
    "auth/seller_register",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            // console.log(info);
            const { data } = await api.post("/seller-register", info, {
                withCredentials: true,
            });
            localStorage.setItem("accessToken", data.token);
            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data);
        }
    }
);

export const seller_login = createAsyncThunk(
    "auth/seller_login",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        // console.log(info);
        // rejectWithValue, fulfillWithValue => createAsyncThunk
        try {
            const { data } = await api.post("/seller-login", info, {
                withCredentials: true,
            });
            console.log(data);
            localStorage.setItem("accessToken", data.token);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_user_info = createAsyncThunk(
    "auth/get_user_info",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get("/get-user", {
                withCredentials: true,
            });

            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//UPDATE image
export const profile_image_upload = createAsyncThunk(
    "auth/profile_image_upload",
    async (image, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/profile-image-upload`, image, {
                withCredentials: true,
            });
            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const add_profile_info = createAsyncThunk(
    "auth/add_profile_info",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/add-profile-info`, info, {
                withCredentials: true,
            });
            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async ({ role }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get("/logout", {
                withCredentials: true,
            });
            localStorage.removeItem("accessToken");
            if (role === "admin") {
                window.location.href = "/admin/login";
            } else {
                window.location.href = "/login";
            }
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const returnRole = (token) => {
    if (token) {
        const decodeToken = jwtDecode(token);
        const expireTime = new Date(decodeToken.exp * 1000);
        if (new Date() > expireTime) {
            localStorage.removeItem("accessToken");
            return "";
        } else {
            return decodeToken.role;
        }
    } else {
        return "";
    }
};

export const authReducer = createSlice({
    name: "auth",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        userInfo: "",
        role: returnRole(localStorage.getItem("accessToken")),
        token: localStorage.getItem("accessToken"),
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(admin_login.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            .addCase(seller_login.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(seller_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            .addCase(seller_register.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(seller_register.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_register.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            .addCase(get_user_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
            })

            //put: image update
            .addCase(profile_image_upload.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(profile_image_upload.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.userInfo = payload.userInfo;
            })

            //add info profile
            .addCase(add_profile_info.pending, (state) => {
                state.loader = true;
            })
            .addCase(add_profile_info.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(add_profile_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.userInfo = payload.userInfo;
            });
    },
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;
