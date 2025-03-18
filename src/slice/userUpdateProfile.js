import { createSlice } from "@reduxjs/toolkit";
import { EditProfile } from "../thunks/EditProfile"
import { FetchUserData } from "../thunks/FetchUserdata"

const userUpdateProfileSlice = createSlice({
    name: 'userUpdateProfile',
    initialState: {
        user: null,
        loading: false,
        error: null,
        updateSuccess: false,
    },

    reducers:{
        clearUpdateSuccess: (state) => {
            state.updateSuccess = false
        }
    },

    extraReducers:(builder) => {
        
        // Fetching user

        builder.addCase(FetchUserData.pending, (state) => {
            state.loading = true;
            state.error = null;
          });
          builder.addCase(FetchUserData.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
          });
          builder.addCase(FetchUserData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });

          // Update profile

          builder.addCase(EditProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.updateSuccess = false;
          });
          builder.addCase(EditProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.updateSuccess = true;
          });
          builder.addCase(EditProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    }
})

export const { clearUpdateSuccess } = userUpdateProfileSlice.actions

export default userUpdateProfileSlice.reducer