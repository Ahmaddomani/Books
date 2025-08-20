import customError from "../utils/customError.js";

//  ? =================== Errors Handlers Functions Start =======================
const validationErrorHandler = (error) => {
  const messages = Object.values(error.errors).map((err) => err.message);
  const cleanMessage = messages
    .join("")
    .split("Path")
    .filter((msg) => msg != "")
    .join(" and")
    .trim()
    .replaceAll(".", "");
  return new customError(400, cleanMessage);
};

const duplicateKeyError = (error) => {
  console.log(error);
  const message = `${
    Object.values(error.keyValue)[0]
  } is existed ,please use another one`;

  return new customError(400, message);
};

//  ? =================== Errors Handlers Functions End =======================

// ? ====================== productionHandler Function Start ==================
const productionHandler = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "SomeThing Got Wrong ! Please Try Later",
    });
  }
};
// ? ====================== productionHandler Function End ==================

const globalErrorHandler = (error, _, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  // Development Function
  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stackTrace: error.stack,
      error: error,
    });
  }
  if (process.env.NODE_ENV === "production") {
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error?.code === 11000) error = duplicateKeyError(error);

    productionHandler(error, res);
  }
};

export default globalErrorHandler;
