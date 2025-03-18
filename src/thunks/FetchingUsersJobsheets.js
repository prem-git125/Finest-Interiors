import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const FetchingUsersJobsheets = createAsyncThunk('/designer-jobsheet', async(_,thunkAPI) => {
    try {
        const response = await api.$get('/jobsheet/designer-jobsheet');

        console.log('API Response -> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.user
    } catch (error) {
        console.log('Error -> ', error)
        return thunkAPI.rejectWithValue({error : error})
    }
})