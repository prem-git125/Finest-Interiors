import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const DeleteNotification = createAsyncThunk('/delete-notification', async (notification_id,thunkAPI) => {
    try {
        const response = await api.$delete(`/notification/delete-notification/${notification_id}`)

        console.log('API Response -> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }

        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue({error: error})
    }
})