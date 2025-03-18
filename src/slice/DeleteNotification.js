import { createSlice } from "@reduxjs/toolkit";
import { DeleteNotification } from "../thunks/DeleteNotification";

const initialState = {
    loading: false,
    error: null,
    success: false,
}

const DeleteNotificationSlice = createSlice({
    name: "DeleteNotification",
    initialState,   
    reducers: {},

    extraReducers: (builder) => {
        builder
        .addCase(DeleteNotification.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(DeleteNotification.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(DeleteNotification.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            state.success = false;
        });
    },
});


export default DeleteNotificationSlice.reducer;