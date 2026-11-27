import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage(data.message);
            setEmail("");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Forgot Password?</h1>
                <p className="auth-subtitle"> Enter your registered email address. We will send you a password reset link.  </p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" required />

                    {message && (<p className="auth-success">{message}</p> )}
                    {error && ( <p className="auth-error">{error}</p> )}

                    <button type="submit" className="auth-button" disabled={loading} >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

                <p className="auth-footer"> Remember your password?{" "} <Link to="/login">Login</Link>  </p>

            </div>
        </div>
    );
}

export default ForgotPassword;
