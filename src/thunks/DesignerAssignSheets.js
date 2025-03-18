import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const DesignerAssignSheets = createAsyncThunk('/designer-assign-sheets', async (id,thunkAPI) => {
    try {
        const response = await api.$get(`/jobsheet/designer-assign-jobsheets/${id}`)
        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.jobsheet
    } catch (error) {
        console.log('Error:',error)
        return thunkAPI.rejectWithValue({error: error})
    }
})