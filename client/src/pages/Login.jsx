import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch,useSelector } from "react-redux";
import { loginThunk } from "../features/auth/authSlice.js";

function Login() {

    // const { login } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading, error } = useSelector((state) => state.auth);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await dispatch(loginThunk({ email, password })).unwrap();

            if (data.user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/books");
            }

        } catch (error) {
            console.error("Login failed:", error);
        } 
    };


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Welcome Back!</h1>
                <p className="auth-subtitle">
                    Login to your Library Manager account
                </p>
                <form className="auth-form" onSubmit={handleSubmit}>

                    <label>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />

                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required  />

                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>

            </div>

        </div>
    );

}

export default Login;
