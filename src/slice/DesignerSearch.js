import { createSlice } from "@reduxjs/toolkit";
import { DesignerSearch } from "../thunks/DesignerSearch";

const DesignerSearchSlice = createSlice({
  name: "DesignerSearch",
  initialState: {
    searchResults: [],
    error: null,
    searchTerm : '',
    status: "idle",
  },
  reducers: {
    setSearchName(state,action) {
        state.searchTerm = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(DesignerSearch.pending, (state) => {
        console.log('testing - loading')
        state.status = "loading";
      })
      .addCase(DesignerSearch.fulfilled, (state, action) => {
        if(action.payload) {
          state.searchResults = action.payload;
        }else{
          console.log('No data found!')
        }
        state.status = "succeeded";
        console.log('Action -> ',action.payload)
      })
      .addCase(DesignerSearch.rejected, (state, action) => {
        console.log('testing - failed ')
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const { setSearchName } =DesignerSearchSlice.actions
export default DesignerSearchSlice.reducer;