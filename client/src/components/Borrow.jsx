import { useState } from "react";
import { borrowBook } from "../api/borrowApi.js";

function Borrow({ book, onBorrowed  }) {

    const [showModal , setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate=[today.getFullYear(),String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

       // const parsedDate = new Date(dueDate);
        // if (!dueDate || Number.isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
        //     setError("Enter a valid future due date, for example 2026-12-31.");
        //     return;
        // }
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(`${dueDate}T00:00:00`);
        const todayDate = new Date(`${minDate}T00:00:00`);

        if (!dueDate || Number.isNaN(selectedDate.getTime()) || selectedDate <= today) {
            setError("Please select a future due date.");
            return;
        }
        try {
            setLoading(true);
            const borrowData = {book: book._id,name:name.trim(), email:email.trim(), dueDate };
            const response = await borrowBook(borrowData);
            onBorrowed(book._id, response.borrow);
            setName("");
            setEmail("");
            setDueDate("");
            setShowModal(false);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to borrow this book.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <form className="borrow-form" onSubmit={handleSubmit}>
        //     <label htmlFor={`due-date-${book._id}`}>Due date</label>
        //     {/* <input id={`due-date-${book._id}`} type="text" placeholder="YYYY-MM-DD" value={dueDate} onChange={(event) => setDueDate(event.target.value)} disabled={loading} /> */}

        //    <input id={`due-date-${book._id}`} type="date"  value={dueDate} min ={new Date().toLocaleDateString('en-CA')}  onChange={(event) => setDueDate(event.target.value)} disabled={loading} />


        //     <button type="submit" disabled={loading}>
        //         {loading ? "Borrowing..." : "Borrow book"}
        //     </button>
        //     {message && <p className="form-message form-success">{message}</p>}
        //     {error && <p className="form-message form-error">{error}</p>}
        // </form>

        <>
            <button type="button" className="borrow-open-button" onClick={() => { setError(""); setShowModal(true); }} disabled={book.quantity < 1}  >
                Borrow Book
            </button>

            {showModal && (
                <div className="borrow-modal-overlay" onClick={() => !loading && setShowModal(false)} >
                    <div className="borrow-modal" onClick={(event) => event.stopPropagation()} >
                        <button type="button" className="borrow-modal-close" onClick={() => setShowModal(false)} disabled={loading} >
                            &times;
                        </button>

                        <div className="borrow-modal-header">
                            <h2>Borrow Book</h2>
                            <p>
                                Enter your details to borrow this book.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="borrow-form-group">
                                <label htmlFor={`borrow-name-${book._id}`}>
                                    Student Name
                                </label>

                                <input id={`borrow-name-${book._id}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required disabled={loading}  />
                            </div>

                            <div className="borrow-form-group">
                                <label htmlFor={`borrow-email-${book._id}`}>
                                    Email Address
                                </label>

                                <input id={`borrow-email-${book._id}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)}placeholder="Enter your email" required disabled={loading}  />
                            </div>

                            <div className="borrow-form-group">
                                <label htmlFor={`borrow-date-${book._id}`}>
                                    Return Date
                                </label>

                                <input id={`borrow-date-${book._id}`} type="date" value={dueDate} min={minDate} onChange={(e) => setDueDate(e.target.value)} required disabled={loading} />
                            </div>

                            {error && (<p className="borrow-modal-error">{error}</p>  )}

                            <button type="submit" className="borrow-confirm-button" disabled={loading} >
                                {loading ? "Processing..." : "Confirm Borrow"}
                            </button>

                            <button type="button" className="borrow-cancel-button" onClick={() => setShowModal(false)}disabled={loading} >
                                Cancel
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Borrow;