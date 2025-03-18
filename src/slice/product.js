import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from '../thunks/product'

const initialState = {
    products: [],
    isLoading: false,
    error: null,
};

const productsSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts(state, action) {
            state.products = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;
