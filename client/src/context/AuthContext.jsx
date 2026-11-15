
import { createContext, useContext, useState } from "react";
import { loginUser, signupUser } from "../api/authApi.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {const savedUser = localStorage.getItem("user");return savedUser ? JSON.parse(savedUser) : null; });

    const [token, setToken] = useState(() => {return localStorage.getItem("token") || null;});

    const saveAuthData = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
    };

    const login = async (userData) => {const data = await loginUser(userData);saveAuthData(data); return data;};

    const signup = async (userData) => {const data = await signupUser(userData);saveAuthData(data);  return data;};

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{user,token,login,signup,logout,isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
