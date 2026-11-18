import express from "express";
import mongoose from "mongoose";
import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", async (req, res) => {
    try {
        const borrows = await Borrow.find({ user: req.user._id }).populate("book", "title category") .sort({ createdAt: -1 });

        res.status(200).json({message: "Borrowing records fetched successfully",borrows});
    } catch (error) {
        console.error("Get borrows error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid borrow ID" });
        }

        const borrow = await Borrow.findOne({_id: id,user: req.user._id}).populate("book", "title category");

        if (!borrow) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        res.status(200).json({ message: "Borrow record fetched", borrow });
    } catch (error) {
        console.error("Get borrow error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { book, dueDate } = req.body;

        if (!book || !dueDate) {
            return res.status(400).json({
                message: "Book and due date are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(book)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        const parsedDueDate = new Date(dueDate);

        if (Number.isNaN(parsedDueDate.getTime()) || parsedDueDate <= new Date()) {
            return res.status(400).json({ message: "Please provide a valid future due date" });
        }

        const bookExists = await Book.findById(book);

        if (!bookExists) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (bookExists.quantity < 1) {
            return res.status(400).json({ message: "Book is not available" });
        }

        const existingBorrow = await Borrow.findOne({user: req.user._id,book,status: { $in: ["borrowed", "overdue"] } });

        if (existingBorrow) {
            return res.status(400).json({message: "You already have this book borrowed"  });
        }

        const borrow = await Borrow.create({user: req.user._id,book,dueDate: parsedDueDate  });

        bookExists.quantity -= 1;
        await bookExists.save();

        const populatedBorrow = await Borrow.findById(borrow._id)  .populate("book", "title category");

        res.status(201).json({message: "Book borrowed successfully",borrow: populatedBorrow});
    } catch (error) {
        console.error("Borrow book error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.patch("/:id/return", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid borrow ID" });
        }

        const borrow = await Borrow.findOne({_id: id,user: req.user._id});

        if (!borrow) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        if (borrow.status === "returned") {
            return res.status(400).json({ message: "Book already returned" });
        }

        borrow.status = "returned";
        borrow.returnDate = new Date();
        await borrow.save();

        await Book.findByIdAndUpdate(borrow.book, {
            $inc: { quantity: 1 }
        });

        res.status(200).json({
            message: "Book returned successfully",
            borrow
        });
    } catch (error) {
        console.error("Return book error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
