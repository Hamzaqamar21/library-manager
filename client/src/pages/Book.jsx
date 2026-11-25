import { useState, useEffect } from "react";
// import { getBooks } from "../api/bookApi.js";
import {useDispatch,useSelector} from "react-redux";
import { fetchBooksThunk } from "../features/books/bookSlice.js";
import BookForm from "../components/BookForm.jsx";
// import { useAuth } from "../context/AuthContext.jsx";
import {useSearchParams} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Books() {
    // const { user } = useAuth();
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === "admin";

    // const [books, setBooks] = useState([]);

    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    // const [categories, setCategories] = useState([]);


    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm=searchParams.get("search") || "";
    const categoryFilter=searchParams.get("category") || "";
    const availabilityFilter=searchParams.get("availability") || "all";

    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");
    const {books,categories,totalPages,loading,error} = useSelector((state) => state.books);
    const  [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();

    // const [showBookForm, setShowBookForm] = useState(false);

    const [showBookForm, setShowBookForm] = useState(false);


    // useEffect(() => {

        
    //     const fetchBooks = async () => {
    //         try {
    //             setLoading(true);
    //             setError("");
    //             const data = await getBooks({page:currentPage, search: searchTerm, category: categoryFilter, availability: availabilityFilter});
    //             setBooks(data.books || []);
    //             setTotalPages(data.totalPages||1);
    //             setCategories(data.categories||[]);

    //         } catch (error) {
    //             setError( error.response?.data?.message || "Failed to load books"  );
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchBooks();

    // }, [currentPage, searchTerm, categoryFilter, availabilityFilter]);

    useEffect(() => {
        dispatch(fetchBooksThunk({page:currentPage, search: searchTerm, category: categoryFilter, availability: availabilityFilter}));      

    },[dispatch, currentPage, searchTerm, categoryFilter, availabilityFilter]);

    const handleSearchChange = (value) => {
        setCurrentPage(1);
        setSearchParams((previous) => {
            const params = new URLSearchParams(previous);

            if (value.trim()) {
                params.set("search", value);
            } else {
                params.delete("search");
            }

            return params;
        })};

    const handleCategoryChange = (value) => {
        setCurrentPage(1);
        setSearchParams((previous) => {
            const params = new URLSearchParams(previous);

            if (value) {
                params.set("category", value);
            } else {
                params.delete("category");
            }

            return params;
        });
    };

    const handleAvailabilityChange = (value) => {
        setCurrentPage(1);
        setSearchParams((previous) => {
            const params = new URLSearchParams(previous);

            if (value !== "all") {
                params.set("availability", value);
            } else {
                params.delete("availability");
            }

            return params;
        });
    };





    // const categories = [...new Set(books.map((book) => book.category).filter(Boolean))].sort();
    const normal = searchTerm.trim().toLowerCase();
    const filteredBooks = books.filter((book) => {
    const matchesSearch = !normal  || [book.title, book.category, book.author?.name] .some((value) => value?.toLowerCase().includes(normal));
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    const matchesAvailability = availabilityFilter === "all" || (availabilityFilter === "available" ? book.quantity > 0 : book.quantity === 0);

        return matchesSearch && matchesCategory && matchesAvailability;
    });

    if (loading) {
        return <div className="library-page"><Navbar /><main className="books-container"><h2>Loading books...</h2></main></div>;
    }

    if (error) {
        return <div className="library-page"><Navbar /><main className="books-container"><h2 style={{ color: "red" }}>{error}</h2></main></div>;
    }

    return (
        <div className="library-page">
            <Navbar />
            <main className="books-container">
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

                         <BookForm onBookCreated={(newBook) => { setBooks((previousBooks) => [newBook, ...previousBooks]);setShowBookForm(false);}} />
                        </div>
                    </div>
                )}

            {books.length > 0 && (
                <div className="book-filters">
                    <label>
                        Search books
                        <input type="search"value={searchTerm} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Search by title, author, or category" />
                    </label>
                    <label>
                        Category
                        <select value={categoryFilter} onChange={(event) => handleCategoryChange(event.target.value)} >
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Availability
                        <select value={availabilityFilter} onChange={(event) => handleAvailabilityChange(event.target.value)} >
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
                        </div>

                    ))}
                </div>

            )}






            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <label className="pagination-page-selector">
                        Page
                        <select
                            aria-label="Select books page"
                            value={currentPage}
                            onChange={(event) => setCurrentPage(Number(event.target.value))}
                        >
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <option key={page} value={page}>{page}</option>
                            ))}
                        </select>
                        of {totalPages}
                    </label>
                    <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}

            </main>
        </div>
    );
}

export default Books;
