import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signupUser } from "../../api/authApi.js";



const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    loading: false,
    error: null,
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
       loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;

            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },

        signupSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;

            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { loginSuccess, signupSuccess, logout, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;