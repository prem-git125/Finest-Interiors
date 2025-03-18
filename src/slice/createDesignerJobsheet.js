import { createSlice } from "@reduxjs/toolkit";
import { createDesignerJobsheet } from "../thunks/createDesignerJobsheet";

const createDesignerJobsheetSlice = createSlice({
    name: 'createDesignerJobsheet',
    initialState: {
        loading: false,
        error: null,
        jobsheet: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createDesignerJobsheet.pending, (state) => {
            state.loading = true;
            state.error = null;  // Reset the error when the request is pending
        })
        .addCase(createDesignerJobsheet.fulfilled, (state, action) => {
            state.loading = false;
            state.jobsheet = action.payload;
        })
        .addCase(createDesignerJobsheet.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;  // Use error message
        });
    }
});

export default createDesignerJobsheetSlice.reducer;
