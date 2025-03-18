import { createSlice } from "@reduxjs/toolkit";
import { authOtp } from "../thunks/authOtp";

const initialState = {
  Otploading: false,
  successMsg: "",
  Otperror: "",
  isOtp: false,
};

const authOtpSlice = createSlice({
  name: "authOtp",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.successMsg = "";
      state.Otperror = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(authOtp.pending, (state) => {
        state.Otploading = true;
        state.Otperror = null;
        state.successMsg = "";
      })

      .addCase(authOtp.fulfilled, (state) => {
        state.Otploading = false;
        state.Otperror = null;
        state.isOtp = true
        state.successMsg = "OTP Accepted!";
      })

      .addCase(authOtp.rejected, (state) => {
        state.Otploading = false;
        state.Otperror = null;
        state.isOtp = false;
        state.successMsg = "OTP Rejected!";
      });
  },
});

export const { clearMessages } = authOtpSlice.actions;
export default authOtpSlice.reducer;
