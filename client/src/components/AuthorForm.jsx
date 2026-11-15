import { useState } from "react";
import { createAuthor } from "../api/authorApi.js";

function AuthorForm({ onAuthorCreated }) {
    const [formData, setFormData] = useState({name: "", bio: "", nationality: "", birthDate: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const birthDate = formData.birthDate
                ? formData.birthDate.replace(/^(\d{2})-(\d{2})-(\d{4})$/, "$3-$2-$1")
                : null;
            const data = await createAuthor({ ...formData, birthDate });

            onAuthorCreated(data.author);
            setFormData({ name: "", bio: "", nationality: "", birthDate: "" });
            setSuccess("Author created successfully!");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Failed to create author");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="book-form-container">
            <h2>Add New Author</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="author-name">Name</label>
                <input id="author-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter author name" required />

                <label htmlFor="author-nationality">Nationality</label>
                <input id="author-nationality" type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Enter nationality" />

                <label htmlFor="author-birth-date">Birth date</label>
                <input id="author-birth-date" type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="DD-MM-YYYY (e.g. 22-10-2005)" />

                <label htmlFor="author-bio">Biography</label>
                <textarea id="author-bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Enter a short biography" />

                {error && <p className="form-message form-error">{error}</p>}
                {success && <p className="form-message form-success">{success}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Adding Author..." : "Add Author"}
                </button>
            </form>
        </div>
    );
}

export default AuthorForm;
