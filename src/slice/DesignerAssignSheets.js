import { createSlice } from "@reduxjs/toolkit";
import { DesignerAssignSheets } from "../thunks/DesignerAssignSheets";

const DesignerAssignSheetsSlice = createSlice({
    name: "DesignerAssignSheets",
    initialState: {
        loading: false,
        error: null,
        data: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(DesignerAssignSheets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DesignerAssignSheets.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(DesignerAssignSheets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default DesignerAssignSheetsSlice.reducer;
