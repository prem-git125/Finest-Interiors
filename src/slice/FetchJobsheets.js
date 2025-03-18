import { createSlice } from "@reduxjs/toolkit";
import { FetchingJobsheets } from "../thunks/FetchJobsheet";

const FetchingJobsheetSlice = createSlice({
    name: "FetchJobsheet",
    initialState: {
        user: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchingJobsheets.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchingJobsheets.fulfilled, (state, action) => {
                state.user = action.payload
                state.loading = false
            })
            .addCase(FetchingJobsheets.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
    }
})
export default FetchingJobsheetSlice.reducer;