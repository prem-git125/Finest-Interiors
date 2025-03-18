import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../api'

export const FetchingDesignerJobsheet = createAsyncThunk('/designer-single-view', async (id, thunkAPI) => {
    try {
        const response = await api.$get(`/jobsheet/designer-single-view/${id}`)

        console.log('API Response --> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.user
    } catch (error) {
        console.log('Error:', error)
        return thunkAPI.rejectWithValue({ error: error })
    }
})