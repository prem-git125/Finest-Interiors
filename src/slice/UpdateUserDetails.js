import { createSlice } from "@reduxjs/toolkit";
import { FetchingUserDetails, UpdatingUserDetails } from "../thunks/UpdateUserDetails";

const UpdateUserDetailsSlice = createSlice({
    name: "UpdateUserDetails",
    initialState: {
        details: null,
        loading: false,
        error: null,
        updateDetailsSuccess: false
    },
    reducers: {
        resetUpdateUserDetails: (state) => {
            state.updateDetailsSuccess = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchingUserDetails.pending, (state) => {
                state.loading = true
            })
            .addCase(FetchingUserDetails.fulfilled, (state, action) => {
                state.details = action.payload
                state.loading = false
            })
            .addCase(FetchingUserDetails.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })
            .addCase(UpdatingUserDetails.pending, (state) => {
                state.loading = true
                console.log('slice test 1')
            })
            .addCase(UpdatingUserDetails.fulfilled, (state, action) => {
                state.updateDetailsSuccess = true
                state.details = action.payload
                console.log(action)
                state.loading = false
            })
            .addCase(UpdatingUserDetails.rejected, (state, action) => {
                state.error = action.payload || action.error.message
                state.loading = false
            })
    }
})

export const { resetUpdateUserDetails } = UpdateUserDetailsSlice.actions
export default UpdateUserDetailsSlice.reducer