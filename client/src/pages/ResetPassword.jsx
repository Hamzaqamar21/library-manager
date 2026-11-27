import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function ResetPassword() {

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/reset-password/${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Password reset failed");
            }

            setMessage(data.message);

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {navigate("/login"); }, 2000);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Reset Password</h1>
                <p className="auth-subtitle"> Enter your new password below. </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>New Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" minLength={6} required />
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" minLength={6} required />

                    {message && (<p className="auth-success">{message}</p>)}
                    {error && (<p className="auth-error">{error}</p> )}

                    <button type="submit" className="auth-button" disabled={loading} >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                </form>

                <p className="auth-footer"> <Link to="/login">Back to Login</Link> </p>

            </div>
        </div>
    );
}

export default ResetPassword;
