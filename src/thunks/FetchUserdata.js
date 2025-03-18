import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../api'

export const FetchUserData = createAsyncThunk('/user-data', async (id,thunkAPI) => {
    try {
        const response = await api.$get(`/auth/user-data/${id}`)
        if(response !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})