import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_category = createAsyncThunk(
    "product/get_category",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/get-categories`, {
                withCredentials: true,
            });
            // console.log("Data home category: ", data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_products = createAsyncThunk(
    "product/get_products",
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get("/home/get-products");
            // console.log("product", data);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.message);
        }
    }
);

export const price_range_product = createAsyncThunk(
    "product/price_range_product",
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get("/home/price-range-product");
            // console.log("product", data);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.message);
        }
    }
);

export const query_products = createAsyncThunk(
    "product/query_products",
    async (query, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/home/query-products?category=${query.category}&&rating=${
                    query.rating
                }&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${
                    query.sortPrice
                }&&pageNumber=${query.pageNumber}&&searchValue=${
                    query.searchValue ? query.searchValue : ""
                }`
            );
            // console.log("product", data);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.message);
        }
    }
);

export const get_product_detail = createAsyncThunk(
    "product/get_product_detail",
    async (slug, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/get-product-detail/${slug}`);
            // console.log("product", data);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.respone);
        }
    }
);

export const customer_review = createAsyncThunk(
    "review/customer_review",
    async (info, { fulfillWithValue }) => {
        try {
            const { data } = await api.post(
                "/home/customer/submit-review",
                info
            );
            //  console.log(data)
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.respone);
        }
    }
);

export const get_reviews = createAsyncThunk(
    "review/get_reviews",
    async ({ productId, pageNumber }, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`
            );
            //  console.log(data)
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.respone);
        }
    }
);

export const get_banners = createAsyncThunk(
    "home/get_banners",
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/get-banners`);
            //  console.log(data)
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response);
        }
    }
);

export const homeReducer = createSlice({
    name: "home",
    initialState: {
        categories: [],
        products: [],
        totalProduct: 0,
        parPage: 3,
        latest_product: [],
        top_rated_product: [],
        discount_product: [],
        priceRange: {
            low: 0,
            high: 0,
        },
        product: {},
        sellerInfo: {},
        relatedProducts: [],
        errorMessage: "",
        successMessage: "",
        totalReview: 0,
        rating_review: [],
        reviews: [],
        banners: [],
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.categories = payload.categories;
            })
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.products = payload.products;
                state.latest_product = payload.latest_product;
                state.top_rated_product = payload.top_rated_product;
                state.discount_product = payload.discount_product;
            })
            .addCase(price_range_product.fulfilled, (state, { payload }) => {
                state.latest_product = payload.latest_product;
                state.priceRange = payload.priceRange;
            })
            .addCase(query_products.fulfilled, (state, { payload }) => {
                state.products = payload.products;
                state.totalProduct = payload.totalProduct;
                state.parPage = payload.parPage;
            })
            .addCase(get_product_detail.fulfilled, (state, { payload }) => {
                state.product = payload.product;
                state.relatedProducts = payload.relatedProducts;
                state.sellerInfo = payload.seller;
            })
            .addCase(customer_review.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })
            .addCase(get_reviews.fulfilled, (state, { payload }) => {
                state.reviews = payload.reviews;
                state.totalReview = payload.totalReview;
                state.rating_review = payload.rating_review;
            })
            .addCase(get_banners.fulfilled, (state, { payload }) => {
                state.banners = payload.banners;
            });
    },
});

export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;
