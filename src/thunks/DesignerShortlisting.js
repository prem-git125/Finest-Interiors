import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const DesignerShortlisting = createAsyncThunk('/designer-jobsheet-shortlist', async (id, thunkAPI) => {
    try {
        const response = await api.$put(`/jobsheet/designer-jobsheet-shortlist/${id}`)

        console.log('API Response -> ',response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        response.data.user
    } catch (error) {
        console.log('Error: ', error )
        return thunkAPI.rejectWithValue({ error : error })
    }
})