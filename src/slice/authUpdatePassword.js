import { createSlice } from "@reduxjs/toolkit";
import { authUpdatePassword } from "../thunks/authUpdatePassword"

const authUpdatePassSlice = createSlice({
    name : 'authUpdatePassword',
    initialState : {
        UpdatePassLoading: false,
        UpdatePassError: null,
        UpdatePassMessage: null,
        isUpdated : false
    },

    reducers:{
        ClearUpdatePassMessage : (state) => {
            state.UpdatePassMessage = null
            state.UpdatePassError = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(authUpdatePassword.pending,(state) => {
                state.UpdatePassLoading = true;
                state.UpdatePassError= null
            })
            
            .addCase(authUpdatePassword.fulfilled,(state,action) => {
                state.UpdatePassLoading = false;
                state.isUpdated = true;
                state.UpdatePassMessage = action.payload.message
            })

            .addCase(authUpdatePassword.rejected,(state,action) => {
                state.UpdatePassLoading = false;
                state.isUpdated = false;
                state.UpdatePassError= action.payload
            })

    }
})

export const { ClearUpdatePassMessage } = authUpdatePassSlice.actions
export default authUpdatePassSlice.reducer;