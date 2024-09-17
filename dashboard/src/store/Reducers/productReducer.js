import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_product = createAsyncThunk(
    "product/add_product",
    async (product, { rejectWithValue, fulfillWithValue }) => {
        try {
            console.log("call api");
            const { data } = await api.post("/product-add", product, {
                withCredentials: true,
            });
            console.log(data);
            console.log("end call api");
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

//GET :all
export const get_products = createAsyncThunk(
    "product/get_products",
    async (
        { parPage, page, searchValue },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/products-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
                {
                    withCredentials: true,
                }
            );
            console.log("Data product: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

//GET :id
export const get_product = createAsyncThunk(
    "product/get_product",
    async (productId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/product-get/${productId}`, {
                withCredentials: true,
            });
            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

//UPDATE
export const update_product = createAsyncThunk(
    "product/update_product",
    async (product, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/update-product`, product, {
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

//UPDATE image
export const product_image_update = createAsyncThunk(
    "product/update_product",
    async (
        { oldImage, newImage, productId },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const formData = new FormData();

            formData.append("oldImage", oldImage);
            formData.append("newImage", newImage);
            formData.append("productId", productId);

            const { data } = await api.put(`/update-image-product`, formData, {
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

export const productReducer = createSlice({
    name: "product",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        products: [],
        product: "",
        totalProduct: 0,
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            //POST
            .addCase(add_product.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(add_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(add_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })

            //GET :all
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.totalProduct = payload.totalProduct;
                state.products = payload.products;
            })
            //GET :ID
            .addCase(get_product.fulfilled, (state, { payload }) => {
                state.product = payload.product;
            })

            //PUT

            .addCase(product_image_update.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.product = payload.product;
            });

        //UPDATE image
    },
});

export const { messageClear } = productReducer.actions;
export default productReducer.reducer;
