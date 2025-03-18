import { createSlice } from "@reduxjs/toolkit"

export const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload
        },
        setToken(state, action) {
            state.token = action.payload
        },
        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload
        },
    },
})

export const { setUser, setToken, setIsAuthenticated } = userSlice.actions
export default userSlice.reducer