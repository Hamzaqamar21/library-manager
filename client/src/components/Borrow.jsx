import { useState } from "react";
import { borrowBook } from "../api/borrowApi.js";

function Borrow({ book, onBorrowed }) {
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        const parsedDate = new Date(dueDate);
        if (!dueDate || Number.isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
            setError("Enter a valid future due date, for example 2026-12-31.");
            return;
        }

        try {
            setLoading(true);
            const response = await borrowBook({ book: book._id, dueDate });
            setDueDate("");
            setMessage("Book borrowed successfully.");
            onBorrowed(book._id, response.borrow);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to borrow this book.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="borrow-form" onSubmit={handleSubmit}>
            <label htmlFor={`due-date-${book._id}`}>Due date</label>
            <input id={`due-date-${book._id}`} type="text" placeholder="YYYY-MM-DD" value={dueDate} onChange={(event) => setDueDate(event.target.value)} disabled={loading} />
            <button type="submit" disabled={loading}>
                {loading ? "Borrowing..." : "Borrow book"}
            </button>
            {message && <p className="form-message form-success">{message}</p>}
            {error && <p className="form-message form-error">{error}</p>}
        </form>
    );
}

export default Borrow;