
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Signup() {

    const { signup } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [adminCode, setAdminCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const data = await signup({ name, email, password, role, adminCode });

            if (data.user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/borrows");
            }

        } catch (error) {
            setError(
                error.response?.data?.message || "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">
                    Join our Library Management System
                </p>
                <form className="auth-form" onSubmit={handleSubmit}>

                    <label>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required />

                    <label>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required/>

                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" minLength={6}required />


                    <label>Sign Up As</label>
                    <select value={role}onChange={(e) => {setRole(e.target.value); setAdminCode("");}}>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>



                    {role === "admin" && (
                        <>
                            <label>Admin Registration Code</label>
                            <input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="Enter admin registration code" required />
                        </>
                    )}
                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    <button type="submit" className="auth-button" disabled={loading} >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>

            </div>

        </div>
    );


}

export default Signup;
