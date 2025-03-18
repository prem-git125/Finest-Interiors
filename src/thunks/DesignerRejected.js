import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const DesignerRejected = createAsyncThunk('/designer-jobsheet-reject', async ({id,rejected_reason},thunkAPI) => {
    try {
        const response = await api.$post(`/jobsheet/designer-jobsheet-reject/${id}`, {rejected_reason})
        
        console.log('API Response --> ',response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        response.data
    } catch (error) {
        console.log('Error:',error)
        return thunkAPI.rejectWithValue({error: error})
    }
})