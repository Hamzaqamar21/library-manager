import {configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import bookReducer from "../features/books/bookSlice.js";
import authorReducer from "../features/authors/authorSlice.js";
import borrowReducer from "../features/borrows/borrowSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        books: bookReducer,
        authors: authorReducer,
        borrows: borrowReducer
    }
})