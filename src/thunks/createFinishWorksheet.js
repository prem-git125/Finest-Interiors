import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const createFinishWorksheet = createAsyncThunk('/designer-finish-work-form', async({formData, job_sheet_id}, thunkAPI) => {
    try {
        const response = await api.$post(`/jobsheet/designer-finish-work-form/${job_sheet_id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

        console.log('API Response --> ',response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.user;
    } catch (error) {
        console.log('Error: ', error)
        return thunkAPI.rejectWithValue({ error : error })
    }
})