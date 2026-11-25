import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBorrowThunk, clearBorrowError } from "../features/borrows/borrowSlice.js";

function Borrow({ book, onBorrowed  }) {

    const dispatch = useDispatch();
    const { mutationLoading: loading, mutationError } = useSelector((state) => state.borrows);
    const [showModal , setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [dueDate, setDueDate] = useState("");
    const [validationError, setValidationError] = useState("");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate=[today.getFullYear(),String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidationError("");
        dispatch(clearBorrowError());

        const selectedDate = new Date(`${dueDate}T00:00:00`);
        if (!dueDate || Number.isNaN(selectedDate.getTime()) || selectedDate <= today) {
            setValidationError("Please select a future due date.");
            return;
        }

        const borrowData = { book: book._id, name: name.trim(), email: email.trim(), dueDate };
        const action = await dispatch(addBorrowThunk(borrowData));
        if (addBorrowThunk.fulfilled.match(action)) {
            onBorrowed(book._id, action.payload.borrow || action.payload);
            setName("");
            setEmail("");
            setDueDate("");
            setShowModal(false);
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
            <button type="button" className="borrow-open-button" onClick={() => { setValidationError(""); dispatch(clearBorrowError()); setShowModal(true); }} disabled={book.quantity < 1}  >
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

                            {(validationError || mutationError) && (<p className="borrow-modal-error">{validationError || mutationError}</p>)}

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