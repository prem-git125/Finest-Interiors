import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../api'

export const FetchingSingleJobsheet = createAsyncThunk('/single-job-sheet', async (id, thunkAPI) => {
    try {
        const response = await api.$get(`/jobsheet/single-job-sheet/${id}`)

        console.log('API Response --> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.user
    } catch (error) {
        return thunkAPI.rejectWithValue({error: error})
    }
})