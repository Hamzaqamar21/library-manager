import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Borrow from "../models/Borrow.js";
import mongoose from "mongoose";


// export const getBooks = async (req, res) => {
//     try{
//         const books = await Book.find().populate("author", "name nationality ").sort({createdAt:-1});
//         res.status(200).json({message:"Books fetched successfully",books});
//     }catch (error) {
//         console.error("Get books error:", error.message);
//         res.status(500).json({message:"Server error"});
//     }
// };


export const getBooks = async (req, res) => {
    try {
        const requestedPage = Number(req.query.page);
        const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
        const limit=12;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.search?.trim()) {
            const search = req.query.search.trim();
            const authors = await Author.find({name: { $regex: search, $options: "i" } }).select("_id");
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                {author: { $in: authors.map(author => author._id) } }
            ];
        }

        if (req.query.category?.trim()) {
            filter.category = req.query.category.trim();
        }

        if(req.query.availability === "available"){
            filter.quantity = { $gt: 0 };
        }else if(req.query.availability === "out-of-stock"){
            filter.quantity = { $eq: 0 };
        }

        const totalBooks=await Book.countDocuments(filter);
        const books = await Book.find(filter).populate("author", "name nationality ").sort({createdAt:-1}).skip(skip).limit(limit);

        const categories= await Book.distinct("category");

        res.status(200).json({
            message: "Books fetched successfully",books, currentPage: page, totalPages: Math.ceil(totalBooks / limit), totalBooks, categories
        });
    }catch (error) {
        console.error("Get books error:", error.message);
        res.status(500).json({message:"Server error"});
    }
};

export const getBookById = async (req, res) => {
    try{
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid book ID"});
        }
        const book = await Book.findById(id).populate("author", "name nationality ");
        if(!book){
            return res.status(404).json({message:"Book not found"});
        }
        res.status(200).json({message:"Book fetched successfully",book});
    }catch (error) {
        console.error("Get book by ID error:", error.message);
        res.status(500).json({message:"Server error"});
    }
}

export const createBook = async (req, res) => {
    try{
        const {title, author, category, description, quantity, publishedYear} = req.body;
        if(!title || !author || !category || quantity === undefined){
            return res.status(400).json({message:"Please provide all required fields"});
        }
        if(!Number.isInteger(quantity) || quantity < 0){
            return res.status(400).json({message:"Invalid quantity"});
        }
        if(!mongoose.Types.ObjectId.isValid(author)){
            return res.status(400).json({message:"Invalid author ID"});
        }
        const authorExists = await Author.findById(author);
        if(!authorExists){
            return res.status(404).json({message:"Author not found"});
        }
        const book = await Book.create({title, author, category, description, quantity, publishedYear});
        const populatedBook = await Book.findById(book._id).populate("author", "name nationality ");
        res.status(201).json({message:"Book created successfully",book:populatedBook});
        
    }catch (error) {
        console.error("Create book error:", error.message);
        res.status(500).json({message:"Server error"});
    }
}


export const updateBook = async (req, res) => {
    try{
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid book ID"});
        }
        const allowedFields = ["title", "author", "category", "description", "quantity", "publishedYear"];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        if(Object.keys(updates).length === 0){
            return res.status(400).json({message:"No valid fields provided for update"});
        }
        if(updates.quantity !== undefined && (!Number.isInteger(updates.quantity) || updates.quantity < 0)){
            return res.status(400).json({message:"Invalid quantity"});
        }

        if(updates.author !== undefined ){

            if(!mongoose.Types.ObjectId.isValid(updates.author)){
                return res.status(400).json({ message:"Invalid author ID"});
            }

            const authorExists = await Author.findById(updates.author);

            if(!authorExists){
                return res.status(404).json({ message:"Author not found"});
            }
        }

        const book = await Book.findByIdAndUpdate(id, updates, {new:true, runValidators:true}).populate("author", "name nationality ");
        if(!book){
            return res.status(404).json({message:"Book not found"});
        }
        res.status(200).json({message:"Book updated successfully",book});
    }catch (error) {
        console.error("Update book error:", error.message);
        res.status(500).json({message:"Server error"});
    }
}


export const deleteBook = async (req, res) => {
    try{
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid book ID"});
        }
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message:"Book not found"});
        }
        const activeBorrows = await Borrow.findOne({book:id, status:{$in:["borrowed","overdue"]}});
        if(activeBorrows){
            return res.status(400).json({message:"Cannot delete a book that is currently borrows"});
            
        }
        await Book.findByIdAndDelete(id);
        res.status(200).json({message:"Book deleted successfully"});
    }catch (error) {
        console.error("Delete book error:", error.message);
        res.status(500).json({message:"Server error"});
    }
}