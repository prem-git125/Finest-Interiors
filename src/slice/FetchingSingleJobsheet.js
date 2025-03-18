import { createSlice } from "@reduxjs/toolkit";
import { FetchingSingleJobsheet } from "../thunks/FetchingSingleJobsheet";

const FetchingSingleJobsheetSlice = createSlice({
    name: "FetchingSingleJobsheet",
    initialState: {
        loading: false,
        error: null, 
        data: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(FetchingSingleJobsheet.pending, (state) => {
            state.loading = true;
        })
        .addCase(FetchingSingleJobsheet.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
        })
        .addCase(FetchingSingleJobsheet.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message
        })
    }
})
export default FetchingSingleJobsheetSlice.reducer;