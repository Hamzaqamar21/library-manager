
import { useState } from "react";
import { createBook } from "../api/bookApi.js";

function BookForm({ onBookCreated }) {

    const [formData, setFormData] = useState({title: "", author: "",category: "", description: "", quantity: "", publishedYear: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const bookData = {
                ...formData,
                quantity: Number(formData.quantity), publishedYear: formData.publishedYear ? Number(formData.publishedYear): null };

            const data = await createBook(bookData);
            onBookCreated(data.book);
            setFormData({ title: "", author: "", category: "", description: "", quantity: "", publishedYear: "" });

            setSuccess("Book created successfully!");

        } catch (error) {
            setError( error.response?.data?.message || "Failed to create book" );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="book-form-container">
            <h2>Add New Book</h2>
            <form onSubmit={handleSubmit}>
                <label>Book Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter book title" required />

                <label>Author ID</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Enter existing Author MongoDB ID" required />

                <label>Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Enter category" required  />

                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter book description" />

                <label>Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" required  />

                <label>Published Year</label>
                <input type="number" name="publishedYear" value={formData.publishedYear} onChange={handleChange} min="1000" max="9999" placeholder="Example: 2020" />

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Adding Book..." : "Add Book"}
                </button>

            </form>

        </div>
    );
}

export default BookForm;
