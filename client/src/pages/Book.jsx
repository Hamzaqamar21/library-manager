
import { useState, useEffect } from "react";
import { getBooks } from "../api/bookApi.js";
import BookForm from "../components/BookForm.jsx";
import Borrow from "../components/Borrow.jsx";
import { Link } from "react-router-dom";

function Books() {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchBooks = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getBooks();
                setBooks(data.books);

            } catch (error) {
                setError( error.response?.data?.message || "Failed to load books"  );
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();

    }, []);

    if (loading) {
        return <h2>Loading books...</h2>;
    }

    if (error) {
        return <h2 style={{ color: "red" }}>{error}</h2>;
    }

    return (
        <div className="books-container">
            <div className="page-navigation">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/authors">Authors</Link>
            </div>
            <h1>Library Books</h1>
            <p>Explore all available books in our library.</p>
             <BookForm onBookCreated={(newBook) => { setBooks((prevBooks) => [newBook, ...prevBooks]); }}/>

            {books.length === 0 ? (
                <h3>No books available yet.</h3>
            ) : (
                <div className="books-grid">
                    {books.map((book) => (
                        <div className="book-card" key={book._id}>
                            <h2>{book.title}</h2>
                            <p>
                                <strong>Author:</strong>{" "}
                                {book.author?.name || "Unknown"}
                            </p>
                            <p>
                                <strong>Category:</strong>{" "}
                                {book.category}
                            </p>
                            <p>
                                <strong>Quantity:</strong>{" "}
                                {book.quantity}
                            </p>
                            <p>
                                <strong>Published Year:</strong>{" "}
                                {book.publishedYear || "Not available"}
                            </p>
                            <p>
                                {book.description || "No description available"}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {book.quantity > 0 ? "Available" : "Out of stock"}
                            </p>
                            {book.quantity > 0 && (
                                <Borrow
                                    book={book}
                                    onBorrowed={(bookId) => {
                                        setBooks((previousBooks) =>
                                            previousBooks.map((currentBook) =>
                                                currentBook._id === bookId
                                                    ? { ...currentBook, quantity: currentBook.quantity - 1 }
                                                    : currentBook,
                                            ),
                                        );
                                    }}
                                />
                            )}
                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Books;
