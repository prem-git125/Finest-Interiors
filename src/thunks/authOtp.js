import { createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../api"


export const authOtp = createAsyncThunk('/verify-otp',async({email,otp},thunkAPI) => {
    try {
        const response = await api.$post("auth/verify-otp",{email,otp});
        if(response.status !== 201) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.data
    } catch (error) {
        return thunkAPI.rejectWithValue({error:error})
    }
})

export const authResendOtp = createAsyncThunk('/resend-otp',async({email},thunkAPI) => {
    try {
        const response = await api.$post("auth/resend-otp",{email});
        if(response.status !== 201) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.data
    } catch (error) {
        return thunkAPI.rejectWithValue({error:error})
    }
})