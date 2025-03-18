import { createSlice } from "@reduxjs/toolkit";
import { FetchingSingleDesignerJobsheetResponse } from "../thunks/FetchingSingleDesignerJobsheetResponse";

const FetchingSingleDesignerJobsheetResponseSlice = createSlice({
    name : 'FetchingSingleDesignerJobsheetResponse',
    initialState : {
        loading: false,
        error : null,
        data : null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(FetchingSingleDesignerJobsheetResponse.pending,(state) => {
            state.loading = true;
        })

        .addCase(FetchingSingleDesignerJobsheetResponse.fulfilled,(state, action) => {
            state.loading = false;
            state.data = action.payload
        })

        .addCase(FetchingSingleDesignerJobsheetResponse.rejected,(state, action) => {
            state.loading = false;
            state.data = action.payload || action.error.message
        })
    }
})

export default FetchingSingleDesignerJobsheetResponseSlice.reducer