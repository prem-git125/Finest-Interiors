import { createSlice } from "@reduxjs/toolkit";
import { ProfileSingleView } from "../thunks/ProfileSingleView";

const ProfileSingleViewSlice = createSlice({
    name: "ProfileSingleView",
    initialState: {
        user: null,
        error: null,
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ProfileSingleView.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(ProfileSingleView.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload
                state.error = null
            })
            .addCase(ProfileSingleView.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message

            })
    }
})

export default ProfileSingleViewSlice.reducer