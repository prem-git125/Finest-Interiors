import { createSlice } from "@reduxjs/toolkit";
import { DesignerShortlisting } from "../thunks/DesignerShortlisting";

const DesignerShortlistingSlice = createSlice({
    name: 'DesignerShortlisting',
    initialState: {
        loadingState: false,
        successState: false,
        shortlistMsg: null,
        errorState: null
    },
   reducers: {},
   extraReducers : (builder) => {
        builder
        .addCase(DesignerShortlisting.pending, (state) => {
            state.loadingState = true
            state.successState = false
        })
        .addCase(DesignerShortlisting.fulfilled, (state,action) => {
            state.loadingState = false
            state.successState = true
            state.shortlistMsg = action.payload.message
        })
        .addCase(DesignerShortlisting.rejected, (state,action) => {
            state.loadingState = false
            state.errorState = action.payload.message
            state.successState = false
        })
   }
})

export default DesignerShortlistingSlice.reducer