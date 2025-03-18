import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../api'

export const createJobsheet = createAsyncThunk('/create-job-sheet', async (formData,thunkAPI) => {
    try {
        const response = await api.$post('/jobsheet/create-job-sheet', formData , {
            headers: {
                'Content-Type': 'multipart/form-data',
                },
        })
        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.user
    } catch (error) {
        return thunkAPI.rejectWithValue({error: error || 'Unknow Error'})
    }
})