import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";


export const authRegister = createAsyncThunk('/register', async(formDataObj,thunkAPI)=>{
  try {
    const response = await api.$post("/auth/register",formDataObj);
    if(response.status !== 201){
      return thunkAPI.rejectWithValue(response.data);
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({error: error});
  }
})