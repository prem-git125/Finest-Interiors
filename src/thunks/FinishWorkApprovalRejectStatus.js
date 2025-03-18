import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const FinishWorkApproval = createAsyncThunk('/finish-work-approval', async (id, thunkAPI) => {
        try {
            const response = await api.$put(`/jobsheet/designer-finish-work-approval/${id}`);
            if (response.status !== 200) {
                return thunkAPI.rejectWithValue(response.data);
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
) 

export const FinishWorkReject = createAsyncThunk('/finish-work-reject', async (id, thunkAPI) => {
    try {
        const response = await api.$put(`/jobsheet/designer-finish-work-reject/${id}`);
        if (response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data);
        }
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
    }
})
