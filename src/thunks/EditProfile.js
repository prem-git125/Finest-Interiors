import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const EditProfile = createAsyncThunk(
  '/edit-profile',
  async ({id,formDataObj}, thunkAPI) => {
    try {
      const response = await api.$put(`/auth/edit-profile/${id}`, formDataObj);
      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);