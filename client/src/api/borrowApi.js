import API from "./client.js";

export const getBorrows = async (filters={}) => {
    const response = await API.get("/borrows", { params: filters });
    return response.data;
};

export const getBorrowById = async (id) => {
    const response = await API.get(`/borrows/${id}`);
    return response.data;
};

export const borrowBook = async (data) => {
    const response = await API.post("/borrows", data);
    return response.data;
};

export const returnBook = async (id) => {
    const response = await API.patch(`/borrows/${id}/return`);
    return response.data;
};