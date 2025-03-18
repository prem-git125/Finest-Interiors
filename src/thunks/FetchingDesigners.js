import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const FetchingDesigners = createAsyncThunk('/designers-data', async (_,thunkAPI) => {
    try {
        const response = await api.$get('/designer/designers-data')

        // console.log('API Response ->',response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue({error: response.data})
        }
        return response.data.user
    } catch (error) {
        return thunkAPI.rejectWithValue(error)   
    }
})