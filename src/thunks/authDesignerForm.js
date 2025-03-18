import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const authDesignerForm = createAsyncThunk('/designer-approval-form',async(formDataObj,thunkAPI) => {
    try {
        const response = await api.$post('/auth/designer-approval-form',formDataObj);
        if(response.status !== 200){
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data;
    }catch(error){
        return thunkAPI.rejectWithValue({error: error})
    }
})