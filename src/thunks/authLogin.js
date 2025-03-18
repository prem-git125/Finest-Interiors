import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";
import { setProfile,setName,setRole } from "../slice/authLogin";


export const authLogin = createAsyncThunk('/login',async({email,password},thunkAPI) => {
    try {
        const response = await api.$post('/auth/login',{email,password})
        console.log('API RESPONSE -->', response.data)
        console.log(response.status);

        if(response.status !== 200){
            return thunkAPI.rejectWithValue(response.data)
        }
        thunkAPI.dispatch(setProfile(response.data.profileUrl))
        thunkAPI.dispatch(setName(response.data.firstName))
        thunkAPI.dispatch(setRole(response.data.role_id))

        return response.data;
    } catch (error) {
        console.log(error);
        return thunkAPI.rejectWithValue({error: error})
    }
})