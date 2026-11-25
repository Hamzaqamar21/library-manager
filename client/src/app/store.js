import {configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import bookReducer from "../features/books/bookSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        books: bookReducer
    }
})