
import { useState , useEffect } from "react";
import { createBook } from "../api/bookApi.js";
import {getAuthors} from "../api/authorApi.js";


function BookForm({ onBookCreated }) {

    const [authors, setAuthors] = useState([]);
    const [loadingAuthors, setLoadingAuthors] = useState(true);
    const [errorAuthors, setErrorAuthors] = useState("");

    const [formData, setFormData] = useState({title: "", author: "",category: "", description: "", quantity: "", publishedYear: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchAuthors = async () => {
            try{
                const data = await getAuthors();
                setAuthors(data.authors||[]);
            }catch(error){
                setErrorAuthors(error.response?.data?.message || "Failed to load authors");
            }finally{
                setLoadingAuthors(false);
            }
        };

        fetchAuthors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // setFormData({...formData, [name]: value });
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.quantity === "" || Number(formData.quantity) < 0 ||
            !Number.isInteger(Number(formData.quantity))) {
            setError("Quantity cannot be negative. Please enter a valid whole number.");
            return;
        }

        const currentYear = new Date().getFullYear();
        if (formData.publishedYear && Number(formData.publishedYear) > currentYear) {
            setError(`Published year must be between 1000 and ${currentYear}.`);
            return;
        }

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

                <label>Author</label>
                <select name="author" value={formData.author} onChange={handleChange} disabled={loadingAuthors || authors.length === 0} placeholder="Enter existing Author MongoDB ID" required >
                    <option value="" >
                        {loadingAuthors ? "Loading authors..." : (authors.length === 0 ? "No authors available" : "Select an author")}
                    </option>
                    {authors.map((author) => (
                        <option key={author._id} value={author._id}>
                            {author.name}
                        </option>
                    ))}
                </select>           
                    
                {errorAuthors && <p style={{ color: "red" }}>{errorAuthors}</p>}
                {!loadingAuthors && !errorAuthors && authors.length === 0 && <p style={{ color: "red" }}>No authors available. Please add an author first.</p>}


                <label>Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Enter category" required  />

                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter book description" />

                <label>Quantity</label>
                <input type="text" inputMode = "numeric"name="quantity" value={formData.quantity} 
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {handleChange(e);}}} required/>

                <label>Published Year</label>
                <input type="number" name="publishedYear" value={formData.publishedYear} onChange={handleChange} min="1000" max={new Date().getFullYear()} placeholder="Example: 2020" />

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
