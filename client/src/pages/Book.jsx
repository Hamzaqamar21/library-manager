
import { useState, useEffect } from "react";
import { getBooks } from "../api/bookApi.js";
import BookForm from "../components/BookForm.jsx";
import Borrow from "../components/Borrow.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Books() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === "admin";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showBookForm, setShowBookForm] = useState(false);

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

    const categories = [...new Set(books.map((book) => book.category).filter(Boolean))].sort();
    const normal = searchTerm.trim().toLowerCase();
    const filteredBooks = books.filter((book) => {
    const matchesSearch = !normal  || [book.title, book.category, book.author?.name] .some((value) => value?.toLowerCase().includes(normal));
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    const matchesAvailability = availabilityFilter === "all" || (availabilityFilter === "available" ? book.quantity > 0 : book.quantity === 0);

        return matchesSearch && matchesCategory && matchesAvailability;
    });

    if (loading) {
        return <h2>Loading books...</h2>;
    }

    if (error) {
        return <h2 style={{ color: "red" }}>{error}</h2>;
    }

    return (
        <div className="books-container">
            <div className="page-navigation">
                {isAdmin && <Link to="/dashboard">Dashboard</Link>}
                {isAdmin && <Link to="/authors">Authors</Link>}
                <button type="button" onClick={handleLogout}>Logout</button>
            </div>
            <h1>Library Books</h1>
            <p>Explore all available books in our library.</p>
             {/* {isAdmin && <BookForm onBookCreated={(newBook) => { setBooks((prevBooks) => [newBook, ...prevBooks]); }}/>} */}

            {isAdmin && (
                    <div className="add-book-section">
                        <button className="add-book-button" onClick={() => setShowBookForm(true)} >
                            + Add New Book
                        </button>
                    </div>
            )}

            {showBookForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowBookForm(false)} >
                            &times;
                         </button>

                         <BookForm onBookCreated={(newBook) => {
                                    setBooks((previousBooks) => [newBook, ...previousBooks]);
                                    setShowBookForm(false);}}
                            />
                        </div>
                    </div>
                )}

            {books.length > 0 && (
                <div className="book-filters">
                    <label>
                        Search books
                        <input type="search"value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by title, author, or category" />
                    </label>
                    <label>
                        Category
                        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} >
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Availability
                        <select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)} >
                            <option value="all">All books</option>
                            <option value="available">Available</option>
                            <option value="out-of-stock">Out of stock</option>
                        </select>
                    </label>
                </div>
            )}

            {books.length === 0 ? (
                <h3>No books available yet.</h3>
            ) : filteredBooks.length === 0 ? (
                <h3>No books match the selected filters.</h3>
            ) : (
                <div className="books-grid">
                    {filteredBooks.map((book) => (
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
                            {isAdmin && book.quantity > 0 && (
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
