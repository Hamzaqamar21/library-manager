import API from "./client.js";

export const getAuthors = async (params = {}) => {
    const response = await API.get("/authors", { params });
    return response.data;
};

export const getAuthorById = async (id) => {
    const response = await API.get(`/authors/${id}`);
    return response.data;
};

export const createAuthor = async (data) => {
    const response = await API.post("/authors", data);
    return response.data;
};

export const updateAuthor = async (id, data) => {
    const response = await API.put(`/authors/${id}`, data);
    return response.data;
};

export const deleteAuthor = async (id) => {
    const response = await API.delete(`/authors/${id}`);
    return response.data;
};