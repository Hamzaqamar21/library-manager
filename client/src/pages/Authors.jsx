import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors } from "../api/authorApi.js";
import AuthorForm from "../components/AuthorForm.jsx";

function Authors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAuthorForm, setShowAuthorForm] = useState(false);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const data = await getAuthors();
                setAuthors(data.authors);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Failed to load authors");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    return (
        <div className="books-container">
            <div className="page-navigation">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/books">Books</Link>
            </div>
            <h1>Library Authors</h1>
            <p>Add and view the authors in your library.</p>
            {/* <AuthorForm onAuthorCreated={(newAuthor) => setAuthors((previous) => [newAuthor, ...previous])} /> */}


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

                        <AuthorForm onAuthorCreated={(newAuthor) => { setAuthors((previous) => [newAuthor, ...previous]); setShowAuthorForm(false); }}/>
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
        </div>
    );
}

export default Authors;
