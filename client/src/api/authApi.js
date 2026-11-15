import API from "./client.js";

export const loginUser = async (userData) => {
    const response = await API.post("/auth/login", userData);
    return response.data;
}

export const signupUser = async (userData) => {
    const response = await API.post("/auth/signup", userData);
    return response.data;
}