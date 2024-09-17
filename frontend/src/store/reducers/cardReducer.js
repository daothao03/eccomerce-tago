import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_to_card = createAsyncThunk(
    "card/add_to_card",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/home/product/add-to-card", info);

            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_card = createAsyncThunk(
    "card/get_card",
    async (userId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/product/get-card/${userId}`);

            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const delete_product_card = createAsyncThunk(
    "card/delete_product_card",
    async (cart_id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(
                `/home/product/delete-product-card/${cart_id}`
            );

            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const quantity_card_inc = createAsyncThunk(
    "card/quantity_card_inc",
    async (cart_id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(
                `/home/product/quantity-card-inc/${cart_id}`
            );

            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const quantity_card_des = createAsyncThunk(
    "card/quantity_card_des",
    async (cart_id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(
                `/home/product/quantity-card-des/${cart_id}`
            );

            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const add_to_wishlist = createAsyncThunk(
    "wishlist/add_to_wishlist",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(
                "/home/product/add-to-wishlist",
                info
            );
            // console.log(data)
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_wishlist = createAsyncThunk(
    "wishlist/get_wishlist",
    async (userId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/home/product/get-wishlist/${userId}`
            );
            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const remove_product_wishlist = createAsyncThunk(
    "wishlist/remove_product_wishlist",
    async (wishlist_id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(
                `/home/product/remove-product-wishlist/${wishlist_id}`
            );

            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const cardReducer = createSlice({
    name: "card",
    initialState: {
        card_products: [],
        card_product_count: 0,
        wishlist_count: 0,
        wishlists: [],
        price: 0,
        errorMessage: "",
        successMessage: "",
        shipping_fee: 0,
        outofstock_products: [],
        buy_product_item: 0,
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
        reset_count: (state, _) => {
            state.card_product_count = 0;
            state.wishlist_count = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_to_card.rejected, (state, { payload }) => {
                state.errorMessage = payload.error;
            })
            .addCase(add_to_card.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.card_product_count = state.card_product_count + 1;
            })
            .addCase(get_card.fulfilled, (state, { payload }) => {
                state.card_products = payload.card_products;
                state.price = payload.price;
                state.card_product_count = payload.card_product_count;
                state.shipping_fee = payload.shipping_fee;
                state.outofstock_products = payload.outOfStockProduct;
                state.buy_product_item = payload.buy_product_item;
            })

            .addCase(delete_product_card.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })
            .addCase(quantity_card_inc.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })
            .addCase(quantity_card_des.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })
            .addCase(add_to_wishlist.rejected, (state, { payload }) => {
                state.errorMessage = payload.error;
            })
            .addCase(add_to_wishlist.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.wishlist_count =
                    state.wishlist_count > 0 ? state.wishlist_count + 1 : 1;
            })
            .addCase(get_wishlist.fulfilled, (state, { payload }) => {
                state.wishlists = payload.wishlists;
                state.wishlist_count = payload.wishlist_count;
            })
            .addCase(
                remove_product_wishlist.fulfilled,
                (state, { payload }) => {
                    state.successMessage = payload.message;
                    state.wishlist_count = state.wishlist_count - 1;
                    state.wishlists = state.wishlists.filter(
                        (p) => p._id !== payload.wishlist_id
                    );
                }
            );
    },
});

export const { messageClear, reset_count } = cardReducer.actions;
export default cardReducer.reducer;
