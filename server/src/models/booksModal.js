import { model, Schema } from "mongoose";

// Function To Add Type String And required Automatic
const stringRequired = () => {
  return {
    type: String,
    required: true,
  };
};

// Create Schema
const bookSchema = new Schema(
  {
    title: { ...stringRequired(), unique: true },
    author: stringRequired(),
    publishYear: stringRequired(),
    photo: String,
    description: String,
    genres: [String],
    pages: Number,
    language: String,
    rating: Number,
  },
  { timestamps: true }
);

// Model
const Book = model("Book", bookSchema);

export default Book;
