import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthorForm from "../components/AuthorForm.jsx";
import Navbar from "../components/Navbar.jsx";
import { fetchAuthorsThunk } from "../features/authors/authorSlice.js";

function Authors() {
    const dispatch = useDispatch();
    const { authors, loading, error, totalPages } = useSelector((state) => state.authors);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAuthorForm, setShowAuthorForm] = useState(false);

    useEffect(() => {
        dispatch(fetchAuthorsThunk({ page: currentPage }));
    }, [currentPage, dispatch]);

    return (
        <div className="library-page">
            <Navbar />
            <main className="books-container">
            <h1>Library Authors</h1>
            <p>Add and view the authors in your library.</p>
            <div className="add-book-section">
                <button className="add-book-button" onClick={() => setShowAuthorForm(true)} >
                    + Add New Author
                </button>
            </div>

            {showAuthorForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowAuthorForm(false)} >
                            &times;
                        </button>

                        <AuthorForm onAuthorCreated={() => setShowAuthorForm(false)} />
                    </div>
                </div>
            )}





            {loading && <h2>Loading authors...</h2>}
            {error && <p className="form-message form-error">{error}</p>}
            {!loading && !error && authors.length === 0 && <h3>No authors available yet.</h3>}
            {!loading && !error && authors.length > 0 && (
                <div className="books-grid">
                    {authors.map((author) => (
                        <article className="book-card" key={author._id}>
                            <h2>{author.name}</h2>
                            {author.nationality && <p><strong>Nationality:</strong> {author.nationality}</p>}
                            {author.birthDate && (
                                <p><strong>Birth date:</strong> {new Date(author.birthDate).toLocaleDateString()}</p>
                            )}
                            <p>{author.bio || "No biography available"}</p>
                        </article>
                    ))}
                </div>
            )}



            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage((previous) => previous - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <label className="pagination-page-selector">
                        Page
                        <select
                            aria-label="Select authors page"
                            value={currentPage}
                            onChange={(event) => setCurrentPage(Number(event.target.value))}
                        >
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <option key={page} value={page}>{page}</option>
                            ))}
                        </select>
                        of {totalPages}
                    </label>
                    <button onClick={() => setCurrentPage((previous) => previous + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}

            </main>
        </div>
    );
}

export default Authors;
