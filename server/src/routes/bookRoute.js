import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBooks,
  getSingleBook,
  updateBook,
} from "../controllers/bookControllers.js";
import { restrict } from "../controllers/authControllers.js";

const bookRouter = Router();

bookRouter.route("/").get(getBooks);
bookRouter.route("/add").post(createBook);
bookRouter
  .route("/:id")
  .get(getSingleBook)
  .patch(restrict("admin"), updateBook)
  .delete(restrict("admin"), deleteBook);

export default bookRouter;
