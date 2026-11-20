import express from "express";
import mongoose from "mongoose";
import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {
        let filter = {};

        if (req.user.role !== "admin") {
            filter.user = req.user._id;
        }

        if (req.query.student?.trim()&& req.user.role === "admin") {
            const searchStudent = req.query.student.trim();
            const student = await User.find({role: "student", $or: [{name: { $regex: req.query.student, $options: "i" }}, {email: { $regex: req.query.student, $options: "i" }}]}).select("_id");
            filter.user = { $in: student.map(user => user._id) };
        }

        if (req.query.book?.trim()) {
            const searchBook = req.query.book.trim();
            const books = await Book.find({title: { $regex: req.query.book, $options: "i" } }).select("_id");
            filter.book = { $in: books.map(books => books._id) };
        }

        if (req.query.from || req.query.to) {
            filter.borrowDate = {};
            if (req.query.from) {
                filter.borrowDate.$gte = new Date(req.query.from);
            }

            if (req.query.to) {
                const endDate = new Date(req.query.to);
                endDate.setHours(23, 59, 59, 999);
                filter.borrowDate.$lte = endDate;
            }
        }

        const hasPagination = req.query.page !== undefined;
        const requestedPage = Number(req.query.page);
        const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const totalBorrows = await Borrow.countDocuments(filter);
        const borrowQuery = Borrow.find(filter).populate("user", "name email").populate("book", "title category") .sort({ createdAt: -1 });
        if (hasPagination) {
            borrowQuery.skip(skip).limit(limit);
        }
        const borrows = await borrowQuery;

        res.status(200).json({
            message: "Borrowing records fetched successfully",
            borrows,
            currentPage: page,
            totalPages: hasPagination ? Math.ceil(totalBorrows / limit) : 1,
            totalBorrows,
        });
    } catch (error) {
        console.error("Get borrows error:", error); res.status(500).json({ message: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid borrow ID" });
        }

        const borrow = req.user.role === "admin" ? await Borrow.findById(id).populate("user", "name email").populate("book", "title category") : await Borrow.findOne({_id: id,user: req.user._id}).populate("user", "name email").populate("book", "title category");

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
        const { book, dueDate ,name,email} = req.body;

        if (!book || !dueDate||!email?.trim()||!name?.trim()) {
            return res.status(400).json({
                message: "Book ,name , email and due date are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(book)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        const parsedDueDate = new Date(dueDate);

        if (Number.isNaN(parsedDueDate.getTime()) || parsedDueDate <= new Date()) {
            return res.status(400).json({ message: "Please provide a valid future due date" });
        }

        let borrower;
        if(req.user.role === "admin") {
            borrower = await User.findOne({ email:email.trim().toLowerCase() ,role:"student"});
            if (!borrower) {
                return res.status(404).json({ message: "Student not found" });
            }

        }else {borrower = req.user;}

        if(borrower.name.trim().toLowerCase() !== name.trim().toLowerCase()){
                return res.status(400).json({ message: "Name does not match the email provided" });
        }
        

        const bookExists = await Book.findById(book);

        if (!bookExists) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (bookExists.quantity < 1) {
            return res.status(400).json({ message: "Book is not available" });
        }

        const existingBorrow = await Borrow.findOne({user: borrower._id,book,status: { $in: ["borrowed", "overdue"] } });

        if (existingBorrow) {
            return res.status(400).json({message: "You already have this book borrowed"  });
        }

        const borrow = await Borrow.create({user: borrower._id,book,dueDate: parsedDueDate  });

        bookExists.quantity -= 1;
        await bookExists.save();

        const populatedBorrow = await Borrow.findById(borrow._id).populate("user", "name email").populate("book", "title category");

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

        // const borrow = await Borrow.findOne({_id: id,user: req.user._id});
        const borrow = req.user.role === "admin" ? await Borrow.findById(id) : await Borrow.findOne({_id: id,user: req.user._id});

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
