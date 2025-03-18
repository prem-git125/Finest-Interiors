import { createSlice } from "@reduxjs/toolkit";
import { FetchingDesignerJobsheet } from "../thunks/FetchingDesignerJobsheet";

const FetchingDesignerJobsheetSlice = createSlice({
    name : 'FetchingDesignerJobsheet',
    initialState : {
        jobsheet : null,
        error: null,
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(FetchingDesignerJobsheet.pending, (state) => {
          state.loading = true;
        })
        .addCase(FetchingDesignerJobsheet.fulfilled, (state, action) => {
          state.jobsheet = action.payload;
          state.loading = false;
        })
        .addCase(FetchingDesignerJobsheet.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch jobsheet";
        });
    }
}) 

export default FetchingDesignerJobsheetSlice.reducer;