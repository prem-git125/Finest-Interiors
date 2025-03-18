import { createSlice } from "@reduxjs/toolkit";
import { CreatePayment, PaymentStatus } from "../thunks/CreatePayment";

const CreatePaymentSlice = createSlice({
    name: 'CreatePayment',
    initialState: {
        orderId: null,
        loading: false,
        error: null,
        paymentSuccess: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(CreatePayment.pending, (state) => {
                state.loading = true
            })
            .addCase(CreatePayment.fulfilled, (state,action) => {
                state.loading = false
                state.orderId = action.payload 
            })
            .addCase(CreatePayment.rejected, (state,action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(PaymentStatus.pending, (state) => {
                state.loading = true
            })
            .addCase(PaymentStatus.fulfilled, (state,action) => {
                state.loading = false
                state.paymentSuccess = action.payload
            })
            .addCase(PaymentStatus.rejected, (state,action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default CreatePaymentSlice.reducer