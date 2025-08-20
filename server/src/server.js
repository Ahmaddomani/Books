import express from "express";
import connectToDb from "./config/db.js";
import Book from "./models/booksModal.js";
import bookRouter from "./routes/bookRoute.js";
import customError from "./utils/customError.js";
import globalErrorHandler from "./controllers/globalErrorHandler.js";
import cors from "cors";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import { protect } from "./controllers/authControllers.js";

// Start Express App
const app = express();

// Allowed Url To Ask For This Server
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.111:3000",
      "http://burly-fold1234.surge.sh",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// -----------------Create Limiter Start -----------------
const RouteLimiter = rateLimit({
  limit: 1000,
  windowMs: 60 * 60 * 1000,
  message: "You Can't Make More Request , Please Try After 1 Hour",
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});
// -----------------Create Limiter End -----------------

// Define the port
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

// use Book Router
app.use("/books", protect, RouteLimiter, bookRouter);
app.use("/auth", RouteLimiter, authRouter);

// handle not Found Error
app.use((req, res, next) => {
  const error = new customError(404, "This Page is Not Found");
  next(error);
});

app.use(globalErrorHandler);
// Connect to Db
connectToDb().then(() => {
  app.listen(port, () => {
    console.log("Server Is Listening on Port....", port);
  });
});
