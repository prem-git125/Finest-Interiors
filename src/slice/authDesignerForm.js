import { createSlice } from "@reduxjs/toolkit";
import { authDesignerForm } from "../thunks/authDesignerForm";

const authDesignerFormSlice = createSlice({
    name: 'authDesignerForm',
    initialState:{
        formStatus: 'idle',
        formError: null,
        user: null
    },

    reducers:{},

    extraReducers: (builder) => {
        builder
            .addCase(authDesignerForm.pending, (state) => {
                state.formStatus = 'loading'
                state.formError = null
            })

            .addCase(authDesignerForm.fulfilled, (state,action) => {
                state.formStatus = 'success'
                state.formError = null
                state.user = action.payload.user
            })

            .addCase(authDesignerForm.rejected, (state,action) => {
                state.formStatus = 'failed'
                state.formError = action.payload
            })
    }
})

export const selectFormStatus = (state) => state.authDesignerForm.formStatus;
export const selectFormError = (state) => state.authDesignerForm.formError;
export const selectUser = (state) => state.authDesignerForm.user;

export default authDesignerFormSlice.reducer;