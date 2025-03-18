import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const UserDetails = createAsyncThunk('/add-user-details', async(userDetails,thunkAPI) => {
    try {
        const response = await api.$post('/userdetails/add-user-details',userDetails)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})