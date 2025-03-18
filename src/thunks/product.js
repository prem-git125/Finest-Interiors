import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, thunkAPI) => {
    try {
        const response = await api.$get("/listing/country/list/dropdown");
        if (response.status !== 200) {
            return thunkAPI.rejectWithValue({ error: response.data });
        }
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue({ error: error });
    }
});
