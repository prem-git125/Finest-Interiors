import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const createDesignerJobsheet = createAsyncThunk(
  "/create-designer-apply-jobsheet",
  async ({formData, job_sheet_id} , thunkAPI) => {  // formData first, thunkAPI second
    try {
      const response = await api.$post(
        `/jobsheet/create-designer-apply-jobsheet/${job_sheet_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log('API Response --> ', response.data);

      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(response.data);
      }

      return response.data;
    } catch (error) {
      console.log("Error : ", error);
      return thunkAPI.rejectWithValue({ error: error.response.data.error || error.message });  // Pass error message
    }
  }
);