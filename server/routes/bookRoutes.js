import express from "express";
import {getBooks, getBookById, createBook, updateBook, deleteBook} from "../controllers/bookController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({message:"Access denied"});
    }
    next();
}

router.use(authMiddleware);

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", adminOnly, createBook);
router.put("/:id", adminOnly, updateBook);
router.delete("/:id", adminOnly, deleteBook);

export default router;