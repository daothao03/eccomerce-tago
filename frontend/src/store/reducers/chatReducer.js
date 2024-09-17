import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_friend = createAsyncThunk(
    "chat/add_friend",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(
                `/chat/customer/add-customer-friend`,
                info
            );
            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const send_message_to_seller = createAsyncThunk(
    "chat/send_message_to_seller",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(
                `/chat/customer/send-message-to-seller`,
                info
            );
            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.log(error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const chatReducer = createSlice({
    name: "chat",
    initialState: {
        errorMessage: "",
        successMessage: "",
        my_friends: [],
        fb_messages: [],
        currentFr: "",
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
        updateMessage: (state, { payload }) => {
            state.fb_messages = [...state.fb_messages, payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_friend.fulfilled, (state, { payload }) => {
                state.my_friends = payload.MyFriends;
                state.fb_messages = payload.messages;
                state.currentFr = payload.currentFd;
            })
            .addCase(send_message_to_seller.fulfilled, (state, { payload }) => {
                let tempFriends = state.my_friends;

                let index = tempFriends.findIndex(
                    (f) => f.fdId === payload.message.receiverId
                );

                while (index > 0) {
                    let temp = tempFriends[index];
                    tempFriends[index] = tempFriends[index - 1];
                    tempFriends[index - 1] = temp;
                    index--;
                }
                state.my_friends = tempFriends;
                state.fb_messages = [...state.fb_messages, payload.message];
                state.successMessage = "Message Send Success";
            });
    },
});

export const { messageClear, updateMessage } = chatReducer.actions;
export default chatReducer.reducer;
