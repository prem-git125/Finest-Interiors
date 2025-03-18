// src/slice/authLogin.js
import { createSlice } from "@reduxjs/toolkit";
import { authLogin } from "../thunks/authLogin";

const initialState = {
  isLogin: false,
  loading: false,
  error: null,
  message: null,
  user: null,
  id: '',
  role_id: '' ,
  token: null,
  status: false,
  profileUrl: null,
  firstName: null,
};

const authLoginSlice = createSlice({
  name: "authLogin",
  initialState,
  reducers: {
    clearMsg: (state) => {
      state.message = null;
      state.error = null; 
    },
    setId(state,action){
      state.id = action.payload
    },
    setRole(state,action){
      state.role_id = action.payload
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setProfile(state, action) {
      state.profileUrl = action.payload;
    },
    setName(state, action) {
      state.firstName = action.payload;
    },

    logout: (state) => {
        (state.isLogin = false),
        (state.role_id = '');
        (state.loading = false),
        (state.error = null),
        (state.message = null),
        (state.user = null),
        (state.token = null),
        (state.status = false),
        (state.profileUrl = null),
        (state.firstName = null);
        (state.id = '');
        
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        console.log("Fulfilled Action Payload:", action.payload); 
        state.loading = false;
        state.isLogin = true;
        state.role_id = action.payload.user.role_id
        state.message = action.payload.user.message;
        state.id = action.payload.user.id,
        state.status = action.payload.user.status,
        state.user = action.payload.user,
        state.token = action.payload.token
      })
      .addCase(authLogin.rejected, (state, action) => {
        state.loading = false;
        state.isLogin = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMsg, setId, setStatus, setUser, setToken, setProfile, setName, setRole, logout } =
  authLoginSlice.actions;
export default authLoginSlice.reducer;
