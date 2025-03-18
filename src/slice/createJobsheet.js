import { createSlice } from "@reduxjs/toolkit";
import { createJobsheet } from "../thunks/createJobsheet";

const createJobsheetSlice = createSlice({
    name: "createJobsheet",
    initialState: {
        loading: false,
        error: null,
        jobsheet: null,
        success: false,
    },
    reducers: {
        resetJobsheetState: (state) => initialState, // Resets state to initial
      },
    extraReducers: (builder) => {
        builder
        .addCase(createJobsheet.pending, (state) => {
            state.loading = true;
            state.success = false;
        })
        .addCase(createJobsheet.fulfilled, (state, action) => {
            state.loading = false;
            state.jobsheet = action.payload;
            state.success = true;
        })
        .addCase(createJobsheet.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message 
            state.success = false;
        })
    }
})

export const { resetJobsheetState } = createJobsheetSlice.actions;
export default createJobsheetSlice.reducer;