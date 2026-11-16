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
        </div>
    );
}

export default Borrows;
