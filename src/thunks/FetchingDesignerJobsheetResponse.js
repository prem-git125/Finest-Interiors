import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const FetchingDesignerJobsheetResponse = createAsyncThunk('/get-designer-jobsheet', async (job_sheet_id, thunkAPI) => {
    try {
        const response = await api.$get(`/jobsheet/get-designer-jobsheet/${job_sheet_id}`)

        console.log('API Response --> ',response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }

        return response.data.user

    } catch (error) {
        console.error('Error: ', error )
        return thunkAPI.rejectWithValue({ error : error })
    }
})
