import { createSlice } from "@reduxjs/toolkit";
import { authRegister } from "../thunks/authRegister";

const initialState = {
    loading: false,
    error: null,
    user: null,
    isRegister: false,
}

const authRegisterSlice = createSlice({
    name: 'authRegister',
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = ''
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(authRegister.pending,(state) => {
                state.loading = true
                state.error = null
                state.message = ''
            })

            .addCase(authRegister.fulfilled,(state,action) => {
                state.loading = false
                state.user = action.payload
                state.isRegister = true
                state.message = 'Registration Suceessfull'
            })

            .addCase(authRegister.rejected,(state,action) => {
                state.loading = false
                state.error = action.payload
                state.isRegister = false
                state.message = 'Registration Failed'
            })
    }
})

export const { clearMessage } = authRegisterSlice.actions;
export default authRegisterSlice.reducer;