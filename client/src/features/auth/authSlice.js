import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {loginUser,signupUser} from '../../api/authApi.js';


const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    loading: false,
    error: null

}

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await loginUser(userData);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed. Please try again.");
        }
    }
);

export const signupThunk = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await signupUser(userData);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Signup failed. Please try again.");
        }
    }
);

export const logoutThunk = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload|| "Login failed. Please try again.";
            })
            .addCase(signupThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(signupThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload|| "Signup failed. Please try again.";
            })

            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.loading = false;
                state.error = null;
            });
    }
});

export default authSlice.reducer;