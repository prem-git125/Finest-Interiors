import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const FetchingJobsheets = createAsyncThunk('/get-job-sheets', async (userId, thunkAPI) => {
    try {
        const response = await api.$get(`/jobsheet/get-job-sheets/${userId}`)

        console.log('API Response --> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.user
    } catch (error) {
        return thunkAPI.rejectWithValue({error: error})
    }
})