import { createSlice } from "@reduxjs/toolkit";
import { FetchingDesignerNotifications } from "../thunks/FetchingDesignerNotifications";

const FetchingDesignerNotificationsSlice = createSlice({
    name: "FetchingDesignerNotifications",
    initialState: {
        notifications: [],
        loading: false,
        error: null
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(FetchingDesignerNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchingDesignerNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload
            })
            .addCase(FetchingDesignerNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message
            })
    }
})

export default FetchingDesignerNotificationsSlice.reducer