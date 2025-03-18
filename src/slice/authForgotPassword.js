import { createSlice } from "@reduxjs/toolkit";
import { authForgotPassword } from "../thunks/authForgotPassword";

const authForgotPassSlice = createSlice({
    name : 'authForgotPassword',
    initialState:{
        ForgotPassLoading: false,
        ForgotPassError: null,
        ForgotPassMessage: null
    },

    reducers:{
      ClearForgotPassMessage : (state) => {
        state.ForgotPassMessage = null;
        state.ForgotPassError = null
      }
    },

    extraReducers: (builder) => {
        builder
            .addCase(authForgotPassword.pending,(state) => {
                state.ForgotPassLoading = true;
                state.ForgotPassError= null
            })
            
            .addCase(authForgotPassword.fulfilled,(state,action) => {
                state.ForgotPassLoading = false;
                state.ForgotPassMessage = action.payload.message
            })

            .addCase(authForgotPassword.rejected,(state,action) => {
                state.ForgotPassLoading = false;
                state.ForgotPassError= action.payload
            })

    }
})

export const {ClearForgotPassMessage} = authForgotPassSlice.actions
export default authForgotPassSlice.reducer