import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const CreatePayment = createAsyncThunk('/create-order', async({ userId, job_sheet_apply_id, amount },thunkAPI) => {
    try {
        const response = await api.$post('/razorpay/create-order', { userId, job_sheet_apply_id, amount })

        console.log('API Response -> ',response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(response.data)
    }
} )

export const PaymentStatus = createAsyncThunk('/payment-status', async(paymentData ,thunkAPI) => {
    try {
        const response = await api.$post('/razorpay/payment-status', paymentData)

        console.log('API Response -> ', response.data)

        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data)
        }
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(response.data)
    }
})