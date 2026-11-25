import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuthorThunk, clearAuthorError } from "../features/authors/authorSlice.js";

function AuthorForm({ onAuthorCreated }) {
    const [formData, setFormData] = useState({name: "", bio: "", nationality: "", birthDate: "" });
    const dispatch = useDispatch();
    const { mutationLoading: loading, mutationError: error } = useSelector((state) => state.authors);
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        dispatch(clearAuthorError());
        setSuccess("");

        const birthDate = formData.birthDate
            ? formData.birthDate.replace(/^(\d{2})-(\d{2})-(\d{4})$/, "$3-$2-$1")
            : null;
        const action = await dispatch(addAuthorThunk({ ...formData, birthDate }));

        if (addAuthorThunk.fulfilled.match(action)) {
            onAuthorCreated(action.payload.author || action.payload);
            setFormData({ name: "", bio: "", nationality: "", birthDate: "" });
            setSuccess("Author created successfully!");
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
