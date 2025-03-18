import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const FetchingUserDetails = createAsyncThunk('/get-user-details', async ({id}, thunkAPI) => {
    try {
        const response = await api.$get(`/userdetails/get-user-details/${id}`)

        console.log('API Response -> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.user
    } catch (error) {
        console.log('Error -> ', error)

        return thunkAPI.rejectWithValue({error: error})
    }
})

export const UpdatingUserDetails = createAsyncThunk('/update-user-details', async ({id,formDetail}, thunkAPI) => {
    try {
        console.log(formDetail)
        const response = await api.$put(`/userdetails/update-user-details/${id}`,formDetail)

        console.log('API Response -> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data.user
    } catch (error) {
        console.log('Error -> ', error)
        return thunkAPI.rejectWithValue({error: error})
    }
})