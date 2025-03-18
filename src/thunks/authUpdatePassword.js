import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const authUpdatePassword = createAsyncThunk('/update-password',async({otp,newPassword},thunkAPI) => {
    try {
        const response = await api.$post("auth/update-password",{
            otp,newPassword
        })
        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue({error : error})
    }
})