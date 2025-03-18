import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const DesignerSearch = createAsyncThunk('/search-designer', async(searchTerm, thunkAPI) => {
    try {
        const response = await api.$get('/designer/search-designer',{
            params:{name: searchTerm}
        })

        console.log('API RESPONSE -> ',response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue({error : response.data})
        }
        return response.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue({error : error.message})
    }
})