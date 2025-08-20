import mongoose from "mongoose";
import Book from "../models/booksModal.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import customError from "../utils/customError.js";

// ?------------------ Get Books Function Start----------------
export const getBooks = asyncErrorHandler(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    length: books.length,
    status: "success",
    data: books,
  });
});
// ?------------------ Get Books Function End----------------

// ?------------------ Get Single Book Function Start----------------
export const getSingleBook = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new customError(400, "invalid Book Id"));
  const book = await Book.findById(id);
  if (!book) return next(new customError(404, "Book Not Found"));
  res.status(200).json({
    status: "success",
    data: book,
  });
});
// ?------------------ Get Single Book Function End----------------

// ?------------------ Create Book Function Start----------------
export const createBook = asyncErrorHandler(async (req, res, next) => {
  const book = await Book.create(req.body);
  res.status(201).json({
    status: "success",
    data: book,
  });
});
// ?------------------ Create Book Function End----------------

// ?------------------ Update Book Function Start----------------
export const updateBook = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, photo, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new customError(400, "invalid Book Id"));
  const book = await Book.findByIdAndUpdate(
    id,
    { title, photo, description },
    { new: true }
  );
  if (!book) return next(new customError(404, "Book Not Found"));
  res.status(200).json({
    status: "success",
    data: book,
  });
});
// ?------------------ Update Book Function End----------------

// ?------------------ Delete Book Function Start----------------
export const deleteBook = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new customError(400, "invalid Book Id"));
  const book = await Book.findByIdAndDelete(id);
  if (!book) return next(new customError(404, "Book Not Found"));
  res.status(200).json({
    status: "success",
    message: "The Book Has Been Deleted Successfully",
  });
});
// ?------------------ Delete Book Function End----------------
