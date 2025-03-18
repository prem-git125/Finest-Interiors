import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const FetchingDesignerNotifications = createAsyncThunk('/get-designer-notifications', async (user_id,thunkAPI) => {
    try {
        const response = await api.$get(`/notification/designer-notifications/${user_id}`)

        console.log('API Response -> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }

        return response.data.notifications

    } catch (error) {
        return thunkAPI.rejectWithValue({error: error})   
    }
})

