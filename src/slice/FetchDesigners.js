import { createSlice } from "@reduxjs/toolkit";
import { FetchingDesigners } from "../thunks/FetchingDesigners";

const FetchDesignerSlice = createSlice({
  name: "FetchDesigners",
  initialState: {
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchingDesigners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(FetchingDesigners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(FetchingDesigners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default FetchDesignerSlice.reducer