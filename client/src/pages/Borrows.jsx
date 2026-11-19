import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../api/bookApi.js";
import { getBorrows, returnBook } from "../api/borrowApi.js";
import Borrow from "../components/Borrow.jsx";

function Borrows() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [borrows, setBorrows] = useState([]);
    const [returningId, setReturningId] = useState("");

    const [showHistory, setShowHistory] = useState(false);
    const [historyFilter, setHistoryFilter] = useState({ student: "", book: "", from: "", to: "" });
    const [historyRecords, setHistoryRecords] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [historySearched, setHistorySearched] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const [booksData, borrowsData] = await Promise.all([getBooks(), getBorrows()]);
                setBooks(booksData.books || []);
                setBorrows(borrowsData.borrows || []);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Failed to load books");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleBorrowed = (bookId, borrow) => {
        setBooks((previousBooks) =>
            previousBooks.map((book) =>
                book._id === bookId ? { ...book, quantity: book.quantity - 1 } : book,
            ),
        );
        setBorrows((previousBorrows) => [...previousBorrows, borrow]);
    };

    const handleReturned = async (borrow) => {
        try {
            setReturningId(borrow._id);
            await returnBook(borrow._id);
            setBorrows((previousBorrows) =>
                previousBorrows.map((currentBorrow) =>
                    currentBorrow._id === borrow._id
                        ? { ...currentBorrow, status: "returned", returnDate: new Date().toISOString() }
                        : currentBorrow,
                ),
            );
            setBooks((previousBooks) =>
                previousBooks.map((book) =>
                    book._id === borrow.book?._id
                        ? { ...book, quantity: book.quantity + 1 }
                        : book,
                ),
            );
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Failed to return book");
        } finally {
            setReturningId("");
        }
    };
    
    const handleHistorySearch = async (event) => {
        event.preventDefault();
        setHistoryError("");
        if(historyFilter.from && historyFilter.to && historyFilter.from > historyFilter.to){
            setHistoryError("The 'From' date cannot be later than the 'To' date.");
            return;
        }
        try{
            setHistoryLoading(true);
            const data = await getBorrows(historyFilter);
            setHistoryRecords(data.borrows || []);
            setHistorySearched(true);
        } catch (error) {
            setHistoryError(error.response?.data?.message || "Failed to fetch history");
        } finally {
            setHistoryLoading(false);
        }
    }

    const handleHistoryFilterChange = (event) => {
        const { name, value } = event.target;
        setHistoryFilter((previous) => ({ ...previous, [name]: value }));
    };

    if (loading) {
        return <h2>Loading books...</h2>;
    }

    if (error) {
        return <h2 className="form-error">{error}</h2>;
    }

    return (
        <div className="borrows-container">
            <div className="page-navigation">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/books">Manage books</Link>
                <Link to="/authors">Authors</Link>
            </div>
            <h1>Borrow books</h1>
            <p>Select a book and enter its due date to borrow it.</p>

            <button type="button" className="search-history-button" onClick={()=>setShowHistory(true)}>
                Search History
            </button>

            {books.length === 0 ? (
                <h3>No books available yet.</h3>
            ) : (
                <div className="books-grid">
                    {books.map((book) => {
                        const activeBorrow = borrows.find(
                            (borrow) =>
                                borrow.book?._id === book._id &&
                                ["borrowed", "overdue"].includes(borrow.status),
                        );

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
                                <Borrow book={book} onBorrowed={handleBorrowed} />
                            )}
                        </div>
                        );
                    })}
                </div>
            )}


            {showHistory && (
                <div className="history-overlay">
                    <div className="history-modal">
                        <button type="button" className="history-close" onClick={() => setShowHistory(false)}>
                            &times;
                        </button>

                        <h2>Borrowing History</h2>
                        <p>Search and view your borrowing history</p>

                        <form onSubmit={handleHistorySearch}>
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

                            {historyError && <p className="form-message form-error">{historyError}</p>}
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
                            </div>
                        )}


                    </div>
                </div>
            )}




        </div>
    );
}

export default Borrows;
