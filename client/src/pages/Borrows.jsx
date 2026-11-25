import { useEffect, useState } from "react";
import { getBooks } from "../api/bookApi.js";
import Borrow from "../components/Borrow.jsx";
import Navbar from "../components/Navbar.jsx";
// import { useAuth } from "../context/AuthContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchBorrowHistoryThunk,
    fetchBorrowsThunk,
    returnBorrowThunk,
} from "../features/borrows/borrowSlice.js";

function Borrows() {
    // const { user } = useAuth();
    const { user } = useSelector((state) => state.auth);
    const {
        borrows,
        loading: borrowsLoading,
        error: borrowsError,
        mutationError,
        historyRecords,
        historyLoading,
        historyError,
        historyTotalPages,
    } = useSelector((state) => state.borrows);
    const dispatch = useDispatch();
    const isAdmin = user?.role === "admin";
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [returningId, setReturningId] = useState("");
    const [bookPage, setBookPage] = useState(1);
    const [bookTotalPages, setBookTotalPages] = useState(1);

    const [showHistory, setShowHistory] = useState(false);
    const [historyFilter, setHistoryFilter] = useState({ student: "", book: "", from: "", to: "" });
    const [historyValidationError, setHistoryValidationError] = useState("");
    const [historySearched, setHistorySearched] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);

    useEffect(() => {
        dispatch(fetchBorrowsThunk());
        const fetchBooks = async () => {
            try {
                const booksData = await getBooks({ page: bookPage });
                setBooks(booksData.books || []);
                setBookTotalPages(booksData.totalPages || 1);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Failed to load books");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [bookPage, dispatch]);

    const handleBorrowed = (bookId) => {
        setBooks((previousBooks) =>
            previousBooks.map((book) =>
                book._id === bookId ? { ...book, quantity: book.quantity - 1 } : book,
            ),
        );
    };

    const handleReturned = async (borrow) => {
        try {
            setReturningId(borrow._id);
            const action = await dispatch(returnBorrowThunk(borrow._id));
            if (returnBorrowThunk.fulfilled.match(action)) {
                setBooks((previousBooks) =>
                    previousBooks.map((book) =>
                        book._id === borrow.book?._id
                            ? { ...book, quantity: book.quantity + 1 }
                            : book,
                    ),
                );
            }
        } finally {
            setReturningId("");
        }
    };
    
    const handleHistorySearch = (event, page = historyPage) => {
        event.preventDefault();
        setHistoryValidationError("");
        if(historyFilter.from && historyFilter.to && historyFilter.from > historyFilter.to){
            setHistoryValidationError("The 'From' date cannot be later than the 'To' date.");
            return;
        }
        dispatch(fetchBorrowHistoryThunk({ ...historyFilter, page }));
        setHistorySearched(true);
    }

    const handleHistoryFilterChange = (event) => {
        const { name, value } = event.target;
        setHistoryFilter((previous) => ({ ...previous, [name]: value }));
    };

    const handleHistoryPageChange = (page) => {
        setHistoryPage(page);
        handleHistorySearch({ preventDefault: () => {} }, page);
    };

    if (loading || borrowsLoading) {
        return <div className="library-page"><Navbar /><main className="borrows-container"><h2>Loading books...</h2></main></div>;
    }

    if (error || borrowsError) {
        return <div className="library-page"><Navbar /><main className="borrows-container"><h2 className="form-error">{error || borrowsError}</h2></main></div>;
    }

    return (
        <div className="library-page">
            <Navbar />
            <main className="borrows-container">
            <h1>Borrow books</h1>
            <p>Select a book and enter its due date to borrow it.</p>
            {mutationError && <p className="form-message form-error">{mutationError}</p>}

            {isAdmin && (
                <button type="button" className="search-history-button" onClick={() => setShowHistory(true)}>
                    Search History
                </button>
            )}

            {books.length === 0 ? (
                <h3>No books available yet.</h3>
            ) : (
                <div className="books-grid">
                    {books.map((book) => {
                        const activeBorrow = !isAdmin ? borrows.find((borrow) =>borrow.book?._id === book._id &&["borrowed", "overdue"].includes(borrow.status),)  : null;
                        return (
                        <div className="book-card" key={book._id}>
                            <h2>{book.title}</h2>
                            <p><strong>Author:</strong> {book.author?.name || "Unknown"}</p>
                            <p><strong>Category:</strong> {book.category}</p>
                            <p><strong>Quantity:</strong> {book.quantity}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {activeBorrow ? "Borrowed" : book.quantity > 0 ? "Available" : "Out of stock"}
                            </p>
                            {activeBorrow && (
                                <button
                                    className="return-book-button"
                                    type="button"
                                    onClick={() => handleReturned(activeBorrow)}
                                    disabled={returningId === activeBorrow._id}
                                >
                                    {returningId === activeBorrow._id ? "Returning..." : "Return book"}
                                </button>
                            )}
                            {!activeBorrow && book.quantity > 0 && (
                                <Borrow book={book} onBorrowed={handleBorrowed} isAdmin={isAdmin} />
                            )}
                        </div>
                        );
                    })}
                </div>
            )}

            {bookTotalPages > 1 && (
                <div className="pagination">
                    <button
                        type="button"
                        onClick={() => setBookPage((previous) => previous - 1)}
                        disabled={bookPage === 1}
                    >
                        Previous
                    </button>
                    <label className="pagination-page-selector">
                        Page
                        <select
                            aria-label="Select books page"
                            value={bookPage}
                            onChange={(event) => setBookPage(Number(event.target.value))}
                        >
                            {Array.from({ length: bookTotalPages }, (_, index) => index + 1).map((page) => (
                                <option key={page} value={page}>{page}</option>
                            ))}
                        </select>
                        of {bookTotalPages}
                    </label>
                    <button
                        type="button"
                        onClick={() => setBookPage((previous) => previous + 1)}
                        disabled={bookPage === bookTotalPages}
                    >
                        Next
                    </button>
                </div>
            )}


            {isAdmin && showHistory && (
                <div className="history-overlay">
                    <div className="history-modal">
                        <button type="button" className="history-close" onClick={() => setShowHistory(false)}>
                            &times;
                        </button>

                        <h2>Borrowing History</h2>
                        <p>Search and view your borrowing history</p>

                        <form onSubmit={(event) => {
                            setHistoryPage(1);
                            handleHistorySearch(event, 1);
                        }}>
                            <label> Student Name Or Email</label>
                            <input type="text" name="student" value={historyFilter.student} onChange={handleHistoryFilterChange} placeholder="Enter student name or email" />
                            <label> Book Name </label>
                            <input type="text" name="book" value={historyFilter.book} onChange={handleHistoryFilterChange} placeholder="Enter book title" />
                            <div className="history-date-fields">
                                <div>
                                    <label> From </label>
                                    <input type="date" name="from" value={historyFilter.from} onChange={handleHistoryFilterChange} />
                                </div>
                                <div>
                                    <label> To </label>
                                    <input type="date" name="to" value={historyFilter.to} min ={historyFilter.from || undefined} onChange={handleHistoryFilterChange} />
                                </div>
                            </div>

                            {(historyValidationError || historyError) && <p className="form-message form-error">{historyValidationError || historyError}</p>}
                            <button type="submit" disabled={historyLoading}>
                                {historyLoading ? "Searching..." : "Search History"}
                            </button>

                        </form>

                        {historySearched && !historyLoading && (
                            <div className="history-results">

                                <h3>
                                    Search Results ({historyRecords.length})
                                </h3>

                                {historyRecords.length === 0 ? (
                                    <p>No borrowing records found.</p>
                                ) : (
                                    <div className="history-table-wrapper">
                                        <table className="history-table">
                                            <thead>
                                                <tr>
                                                    <th>Student</th>
                                                    <th>Book</th>
                                                    <th>Borrow Date</th>
                                                    <th>Due Date</th>
                                                    <th>Return Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {historyRecords.map((record) => (
                                                    <tr key={record._id}>
                                                        <td>
                                                            {record.user?.name || "Unknown"}
                                                            <br />
                                                            {record.user?.email || ""}
                                                        </td>

                                                        <td>
                                                            {record.book?.title || "Deleted book"}
                                                        </td>

                                                        <td>
                                                            {record.borrowDate ? new Date(record.borrowDate).toLocaleDateString()  : "-"}
                                                        </td>

                                                        <td>
                                                            {record.dueDate  ? new Date(record.dueDate).toLocaleDateString()  : "-"}
                                                        </td>

                                                        <td>
                                                            {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : "Not returned"}
                                                        </td>

                                                        <td>
                                                            <span className={`history-status ${record.status}`}> {record.status}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                            )}
                                {historyTotalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            type="button"
                                            onClick={() => handleHistoryPageChange(historyPage - 1)}
                                            disabled={historyPage === 1 || historyLoading}
                                        >
                                            Previous
                                        </button>
                                        <label className="pagination-page-selector">
                                            Page
                                            <select
                                                aria-label="Select borrowing history page"
                                                value={historyPage}
                                                onChange={(event) => handleHistoryPageChange(Number(event.target.value))}
                                                disabled={historyLoading}
                                            >
                                                {Array.from({ length: historyTotalPages }, (_, index) => index + 1).map((page) => (
                                                    <option key={page} value={page}>{page}</option>
                                                ))}
                                            </select>
                                            of {historyTotalPages}
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleHistoryPageChange(historyPage + 1)}
                                            disabled={historyPage === historyTotalPages || historyLoading}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}


                    </div>
                </div>
            )}
            </main>
        </div>
    );
}

export default Borrows;
