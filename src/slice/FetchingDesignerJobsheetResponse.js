import { createSlice } from "@reduxjs/toolkit";
import { FetchingDesignerJobsheetResponse } from "../thunks/FetchingDesignerJobsheetResponse";

const FetchingDesignerJobsheetResponseSlice = createSlice({
    name : 'FetchingDesignerJobsheetResponse',
    initialState: {
        jobsheet: [],
        Loading: false,
        Error: null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(FetchingDesignerJobsheetResponse.pending , (state) => {
            state.Loading = true
        })

        .addCase(FetchingDesignerJobsheetResponse.fulfilled , (state, action) => {
            state.Loading = false
            state.jobsheet = action.payload
        })

        .addCase(FetchingDesignerJobsheetResponse.rejected , (state, action) => {
            state.Loading = false
            state.Error = action.payload || action.error.message
        })
    }
})

export default FetchingDesignerJobsheetResponseSlice.reducer;