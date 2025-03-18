import { createSlice } from "@reduxjs/toolkit";
import { UserDetails } from "../thunks/UserDetails";

const UserDetailsSlice = createSlice({
    name: "UserDetails",
    initialState: {
        userDetails: null,
        error: null,
        status: 'idle'
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(UserDetails.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(UserDetails.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.userDetails = action.payload
        })
        .addCase(UserDetails.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload
        })
    }
})

export default UserDetailsSlice.reducer