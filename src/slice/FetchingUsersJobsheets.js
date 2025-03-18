import { createSlice } from "@reduxjs/toolkit";
import { FetchingUsersJobsheets } from "../thunks/FetchingUsersJobsheets";

const FetchingUsersJobsheetSlice = createSlice({
    name: "FetchingUsersJobsheets",
    initialState: {
        jobsheetData : [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(FetchingUsersJobsheets.pending, (state) => { 
            state.loading = true;
        })
        .addCase(FetchingUsersJobsheets.fulfilled, (state, action) => {
            state.jobsheetData = action.payload;
            state.loading = false;
        })
        .addCase(FetchingUsersJobsheets.rejected, (state, action) => {
            state.error = action.payload || action.error.message;
            state.loading = false;
        })
    }
})

export default FetchingUsersJobsheetSlice.reducer;