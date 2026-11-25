import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { borrowBook, getBorrowById, getBorrows, returnBook } from "../../api/borrowApi.js";

const initialState = {
    borrows: [],
    selectedBorrow: null,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    mutationLoading: false,
    mutationError: null,
    historyRecords: [],
    historyCurrentPage: 1,
    historyTotalPages: 1,
    historyLoading: false,
    historyError: null,
};

export const fetchBorrowsThunk = createAsyncThunk(
    "borrows/fetchBorrows",
    async (filters = {}, { rejectWithValue }) => {
        try {
            return await getBorrows(filters);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch borrows. Please try again.");
        }
    },
);

export const fetchBorrowByIdThunk = createAsyncThunk(
    "borrows/fetchBorrowById",
    async (id, { rejectWithValue }) => {
        try {
            return await getBorrowById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch borrow details. Please try again.");
        }
    },
);

export const addBorrowThunk = createAsyncThunk(
    "borrows/addBorrow",
    async (borrowData, { rejectWithValue }) => {
        try {
            return await borrowBook(borrowData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to borrow book. Please try again.");
        }
    },
);

export const returnBorrowThunk = createAsyncThunk(
    "borrows/returnBorrow",
    async (id, { rejectWithValue }) => {
        try {
            const data = await returnBook(id);
            return { id, borrow: data.borrow || data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to return book. Please try again.");
        }
    },
);

export const fetchBorrowHistoryThunk = createAsyncThunk(
    "borrows/fetchBorrowHistory",
    async (filters = {}, { rejectWithValue }) => {
        try {
            return await getBorrows(filters);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch history. Please try again.");
        }
    },
);

const borrowSlice = createSlice({
    name: "borrows",
    initialState,
    reducers: {
        clearBorrowError: (state) => {
            state.error = null;
            state.mutationError = null;
            state.historyError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBorrowsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBorrowsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.borrows = action.payload.borrows || [];
                state.currentPage = action.payload.currentPage || 1;
                state.totalPages = action.payload.totalPages || 1;
            })
            .addCase(fetchBorrowsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch borrows. Please try again.";
            })
            .addCase(fetchBorrowByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBorrowByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBorrow = action.payload.borrow || action.payload;
            })
            .addCase(fetchBorrowByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch borrow details. Please try again.";
            })
            .addCase(addBorrowThunk.pending, (state) => {
                state.mutationLoading = true;
                state.mutationError = null;
            })
            .addCase(addBorrowThunk.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.borrows.push(action.payload.borrow || action.payload);
            })
            .addCase(addBorrowThunk.rejected, (state, action) => {
                state.mutationLoading = false;
                state.mutationError = action.payload || "Failed to borrow book. Please try again.";
            })
            .addCase(returnBorrowThunk.pending, (state) => {
                state.mutationLoading = true;
                state.mutationError = null;
            })
            .addCase(returnBorrowThunk.fulfilled, (state, action) => {
                state.mutationLoading = false;
                const returnedBorrow = action.payload.borrow;
                const id = returnedBorrow?._id || returnedBorrow?.id || action.payload.id;
                const updateBorrow = (borrow) => {
                    if ((borrow._id || borrow.id) !== id) {
                        return borrow;
                    }
                    return returnedBorrow.status
                        ? returnedBorrow
                        : { ...borrow, status: "returned", returnDate: new Date().toISOString() };
                };
                state.borrows = state.borrows.map(updateBorrow);
                state.historyRecords = state.historyRecords.map(updateBorrow);
                if ((state.selectedBorrow?._id || state.selectedBorrow?.id) === id) {
                    state.selectedBorrow = updateBorrow(state.selectedBorrow);
                }
            })
            .addCase(returnBorrowThunk.rejected, (state, action) => {
                state.mutationLoading = false;
                state.mutationError = action.payload || "Failed to return book. Please try again.";
            })
            .addCase(fetchBorrowHistoryThunk.pending, (state) => {
                state.historyLoading = true;
                state.historyError = null;
            })
            .addCase(fetchBorrowHistoryThunk.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.historyRecords = action.payload.borrows || [];
                state.historyCurrentPage = action.payload.currentPage || 1;
                state.historyTotalPages = action.payload.totalPages || 1;
            })
            .addCase(fetchBorrowHistoryThunk.rejected, (state, action) => {
                state.historyLoading = false;
                state.historyError = action.payload || "Failed to fetch history. Please try again.";
            });
    },
});

export const { clearBorrowError } = borrowSlice.actions;
export default borrowSlice.reducer;
