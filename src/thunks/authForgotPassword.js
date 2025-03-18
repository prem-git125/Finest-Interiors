import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const authForgotPassword = createAsyncThunk('/forgot-password',async({email},thunkAPI) => {
    try {
        const response = await api.$post("auth/forgot-password",{email})     
        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue({error: error})
    }
}) 