import { createSlice } from "@reduxjs/toolkit";
import { DesignerRejected } from "../thunks/DesignerRejected";

const DesignerRejectedSlice = createSlice({
    name : 'DesignerRejected',
    initialState : {
        loading: false,
        error: null,
        data: null,
        success: false,
    },
    reducers : {
        clearMessage: (state) => {
            state.loading = false
            state.data = null
            state.error = null
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(DesignerRejected.pending , (state) => {
            state.loading = true
            state.error = null
            state.data = null
            state.success = false
        })

        .addCase(DesignerRejected.fulfilled , (state,action) => {
            state.loading = false
            state.error = null
            state.data = action.payload.message
            state.success = true
        })

        .addCase(DesignerRejected.rejected , (state,action) => {
            state.loading = false
            state.error = action.payload.message
            state.data = null
            state.success = false
        })
    }
})

export const { clearMessage } = DesignerRejectedSlice.actions
export default DesignerRejectedSlice.reducer