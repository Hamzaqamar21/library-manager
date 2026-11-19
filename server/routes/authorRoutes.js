import express from "express";
import mongoose from "mongoose";
import Author from "../models/Author.js";
import Book from "../models/Book.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", async (req, res) => {
    try {
        // const authors = await Author.find().sort({ createdAt: -1 });

        const requestedPage = Number(req.query.page);
        const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
        const limit = 8;
        const skip = (page - 1) * limit;
        const totalAuthors = await Author.countDocuments();
        const authors = await Author.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({
            message: "Authors fetched successfully",authors, currentPage: page, totalPages: Math.ceil(totalAuthors / limit), totalAuthors
        });
    } catch (error) {
        console.error("Get authors error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }

        const author = await Author.findById(id);

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        res.status(200).json({ message: "Author fetched successfully", author });
    } catch (error) {
        console.error("Get author error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { name, bio, nationality, birthDate } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Author name is required" });
        }

        const author = await Author.create({name,bio,nationality, birthDate});

        res.status(201).json({message: "Author created successfully",author});
    } catch (error) {
        console.error("Create author error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }

        const allowedFields = ["name", "bio", "nationality", "birthDate"];
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const author = await Author.findByIdAndUpdate(id,updates,  { new: true, runValidators: true });

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        res.status(200).json({message: "Author updated successfully",author});
    } catch (error) {
        console.error("Update author error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }

        const author = await Author.findById(id);

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        const books = await Book.findOne({ author: id });

        if (books) {
            return res.status(400).json({
                message: "Cannot delete an author who has books"
            });
        }

        await Author.findByIdAndDelete(id);

        res.status(200).json({ message: "Author deleted successfully" });
    } catch (error) {
        console.error("Delete author error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
