import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {getBooks,getBookById, updateBook, deleteBook} from '../../api/bookApi.js';

const initialState = {
    books: [],
    selectedBook: null,
    categories: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,


    mutationLoading: false,
    mutationError: null
}

export const fetchBooksThunk = createAsyncThunk(
    'books/fetchBooks',
    async (filters={}, { rejectWithValue }) => {
        try {
            const data = await getBooks(filters);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch books. Please try again.");
        }
    }
);


export const fetchBookByIdThunk = createAsyncThunk(
    'books/fetchBookById',
    async (id, { rejectWithValue }) => {
        try {
            const data = await getBookById(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch book details. Please try again.");
        }
    }
);


export const addBookThunk = createAsyncThunk(
    'books/addBook',
    async (bookData, { rejectWithValue }) => {
        try {
            const data = await updateBook(bookData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add book. Please try again.");
        }
    }
);

export const editBookThunk = createAsyncThunk(
    'books/editBook',
    async (id,bookData, { rejectWithValue }) => {
        try {
            const data = await updateBook(id,bookData);        
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update book. Please try again.");
        }
    }
);


export const removeBookThunk = createAsyncThunk(
    'books/removeBook',
    async (id, { rejectWithValue }) => {
        try {
            await deleteBook(id);   
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete book. Please try again.");
        }
    }
);  



const bookSlice = createSlice({
    name: "books",
    initialState,
    reducers: {
        clearBookError: (state) => {
            state.error = null;
            state.mutationError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooksThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooksThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload.books|| [];
                state.categories = action.payload.categories|| [];
                state.currentPage = action.payload.currentPage|| 1;
                state.totalPages = action.payload.totalPages|| 1;
            })
            .addCase(fetchBooksThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch books. Please try again.";
            })
            .addCase(fetchBookByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBook = action.payload;
            })
            .addCase(fetchBookByIdThunk.rejected, (state, action) => {
                state.loading = false;          
                state.error = action.payload || "Failed to fetch book details. Please try again.";
            })


            .addCase(addBookThunk.pending, (state) => {
                state.mutationLoading = true;
                state.mutationError = null;
            })
            .addCase(addBookThunk.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.books.unshift(action.payload);
            })
            .addCase(addBookThunk.rejected, (state, action) => {
                state.mutationLoading = false;
                state.mutationError = action.payload || "Failed to add book. Please try again.";
            })


            .addCase(editBookThunk.pending, (state) => {
                state.mutationLoading = true;
                state.mutationError = null;
            })
            .addCase(editBookThunk.fulfilled, (state, action) => {
                state.mutationLoading = false;
                const updatedBook = state.books.map(book=> book.id === action.payload.id ? updateBook : book);
                if(state.selectedBook?._id === updatedBook.id){
                    state.selectedBook = updatedBook;
                }
            })
            .addCase(editBookThunk.rejected, (state, action) => {
                state.mutationLoading = false;
                state.mutationError = action.payload || "Failed to update book. Please try again.";
            })




            .addCase(removeBookThunk.pending, (state) => {
                state.mutationLoading = true;
                state.mutationError = null;
            })
            .addCase(removeBookThunk.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.books = state.books.filter(book => book.id !== action.payload);
                if(state.selectedBook?._id === action.payload){
                    state.selectedBook = null;
                }
            })
            .addCase(removeBookThunk.rejected, (state, action) => {
                state.mutationLoading = false;
                state.mutationError = action.payload || "Failed to delete book. Please try again.";
            });
    }
})


export const { clearBookError } = bookSlice.actions;
export default bookSlice.reducer;