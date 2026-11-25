import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    createAuthor,
    deleteAuthor,
    getAuthorById,
    getAuthors,
    updateAuthor,
} from "../../api/authorApi.js";

const initialState = {
    authors: [],
    selectedAuthor: null,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    mutationLoading: false,
    mutationError: null,
};

export const fetchAuthorsThunk = createAsyncThunk(
    "authors/fetchAuthors",
    async (filters = {}, { rejectWithValue }) => {
        try {
            return await getAuthors(filters);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch authors. Please try again.");
        }
    },
);

export const fetchAuthorByIdThunk = createAsyncThunk(
    "authors/fetchAuthorById",
    async (id, { rejectWithValue }) => {
        try {
            return await getAuthorById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch author details. Please try again.");
        }
    },
);

export const addAuthorThunk = createAsyncThunk(
    "authors/addAuthor",
    async (authorData, { rejectWithValue }) => {
        try {
            return await createAuthor(authorData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add author. Please try again.");
        }
    },
);

export const editAuthorThunk = createAsyncThunk(
    "authors/editAuthor",
    async ({ id, authorData }, { rejectWithValue }) => {
        try {
            return await updateAuthor(id, authorData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update author. Please try again.");
        }
    },
);

export const removeAuthorThunk = createAsyncThunk(
    "authors/removeAuthor",
    async (id, { rejectWithValue }) => {
        try {
            await deleteAuthor(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete author. Please try again.");
        }
    },
);

const authorSlice = createSlice({
    name: "authors",
    initialState,
    reducers: {
        clearAuthorError: (state) => {
            state.error = null;
            state.mutationError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthorsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuthorsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.authors = action.payload.authors || [];
                state.currentPage = action.payload.currentPage || 1;
                state.totalPages = action.payload.totalPages || 1;
            })
            .addCase(fetchAuthorsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch authors. Please try again.";
            })
            .addCase(fetchAuthorByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuthorByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAuthor = action.payload.author || action.payload;
            })
            .addCase(fetchAuthorByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch author details. Please try again.";
            })
            .addCase(addAuthorThunk.pending, (state) => {
                state.mutationLoading = true;
                state.mutationError = null;
            })
            .addCase(addAuthorThunk.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.authors.unshift(action.payload.author || action.payload);
            })
            .addCase(addAuthorThunk.rejected, (state, action) => {
                state.mutationLoading = false;
                state.mutationError = action.payload || "Failed to add author. Please try again.";
            })
            .addCase(editAuthorThunk.pending, (state) => {
                state.mutationLoading = true;
                state.mutationError = null;
            })
            .addCase(editAuthorThunk.fulfilled, (state, action) => {
                state.mutationLoading = false;
                const updatedAuthor = action.payload.author || action.payload;
                state.authors = state.authors.map((author) =>
                    (author._id || author.id) === (updatedAuthor._id || updatedAuthor.id) ? updatedAuthor : author,
                );
                if ((state.selectedAuthor?._id || state.selectedAuthor?.id) === (updatedAuthor._id || updatedAuthor.id)) {
                    state.selectedAuthor = updatedAuthor;
                }
            })
            .addCase(editAuthorThunk.rejected, (state, action) => {
                state.mutationLoading = false;
                state.mutationError = action.payload || "Failed to update author. Please try again.";
            })
            .addCase(removeAuthorThunk.pending, (state) => {
                state.mutationLoading = true;
                state.mutationError = null;
            })
            .addCase(removeAuthorThunk.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.authors = state.authors.filter((author) => (author._id || author.id) !== action.payload);
                if ((state.selectedAuthor?._id || state.selectedAuthor?.id) === action.payload) {
                    state.selectedAuthor = null;
                }
            })
            .addCase(removeAuthorThunk.rejected, (state, action) => {
                state.mutationLoading = false;
                state.mutationError = action.payload || "Failed to delete author. Please try again.";
            });
    },
});

export const { clearAuthorError } = authorSlice.actions;
export default authorSlice.reducer;
