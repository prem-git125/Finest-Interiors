import { createSlice } from "@reduxjs/toolkit";
import { GetChatUsers } from "../thunks/GetChatUsers";

const GetChatUsersSlice = createSlice({
    name: "GetChatUsers",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(GetChatUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(GetChatUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
          })
          .addCase(GetChatUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
      },
    }
);

export default GetChatUsersSlice.reducer