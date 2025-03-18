import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const GetChatUsers = createAsyncThunk('/chat-users', async ({id, role_id}, thunkAPI) => {
  try {
    const response = await api.$get(`/userdetails/chat-users/${id}`,{
      params: { role_id: role_id }
    })

    console.log('API Response -> ', response.data)

    if(response.status !== 200) {
      return thunkAPI.rejectWithValue(response.data)
    }
    if (role_id === 3) {
      return response.data.users.map(function (user) {
        user.user = user.job_sheet_details.user;
        return user;
      });
    }
    return response.data.users;
  } catch (error) {
    return thunkAPI.rejectWithValue({error: error})
  }  
})