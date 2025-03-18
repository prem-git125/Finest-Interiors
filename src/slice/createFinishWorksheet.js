import { createSlice } from "@reduxjs/toolkit";
import { createFinishWorksheet } from "../thunks/createFinishWorksheet";

const createFinishWorksheetSlice = createSlice({
    name: 'createFinishWorksheet',
    initialState: {
        loading: false,
        error: null,
        user: null,
        success: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(createFinishWorksheet.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(createFinishWorksheet.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.success = true;
          })
          .addCase(createFinishWorksheet.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.success = false;
          });
      },
  });
  
export default createFinishWorksheetSlice.reducer;