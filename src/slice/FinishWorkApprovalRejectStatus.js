import { createSlice } from "@reduxjs/toolkit";
import { FinishWorkApproval } from "../thunks/FinishWorkApprovalRejectStatus";
import { FinishWorkReject } from "../thunks/FinishWorkApprovalRejectStatus";

const initialState = {
    loading: false,
    error: null,
    data: null,
    success: false,
}

const FinishWorkApprovalRejectStatusSlice = createSlice({
    name: "FinishWorkApprovalRejectStatus",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(FinishWorkApproval.pending, (state) => {
            state.loading = true
            state.error = null
            state.data = null
            state.success = false
        })
        .addCase(FinishWorkApproval.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.data = action.payload.message
            state.success = true
        })
        .addCase(FinishWorkApproval.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
            state.data = null
            state.success = false
        })
        .addCase(FinishWorkReject.pending, (state) => {
            state.loading = true
            state.error = null
            state.data = null
            state.success = false
        })
        .addCase(FinishWorkReject.fulfilled, (state, action) => {    
            state.loading = false
            state.error = null  
            state.data = action.payload.message
            state.success = true
        })
        .addCase(FinishWorkReject.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message    
            state.data = null        
            state.success = false
        })
    }
})

export default FinishWorkApprovalRejectStatusSlice.reducer