import jwt from "jsonwebtoken";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import User from "../models/authModal.js";
import util from "util";
import customError from "../utils/customError.js";
import bcrypt from "bcryptjs";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRED,
  });
};

// Create Function to Send Response And Cookies
const createSendResponse = (user, message, res, statusCode) => {
  const options = {
    maxAge: 10 * 24 * 3600 * 1000, // 10 days
    secure: process.env.NODE_ENV === "production", // you cant use this in http you need https
    httpOnly: true, // For just not be read
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  const token = signToken(user.id);

  user.password = undefined;

  res.cookie("jwt", token, options);

  res.status(statusCode).json({
    status: "success",
    data: user,
    token,
    message: message || undefined,
  });
};
//? --------------------------Start Controllers -------------------
export const signup = asyncErrorHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  createSendResponse(user, "Signup Successfully", res, 201);
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new customError(401, "Please Entre Email And Password"));

  const user = await User.findOne({ email }).select("+password");

  // Check from the password
  const isMatch = await user?.comparePasswords(password, user.password);

  if (!user || !isMatch)
    return next(new customError(401, "Wrong Email Or Password"));

  createSendResponse(user, "Logged in Successfully", res, 200);
});

export const protect = asyncErrorHandler(async (req, res, next) => {
  const token = req?.cookies.jwt;

  console.log(token);

  if (!token) return next(new customError(401, "You Are Not Login in"));

  // 3 => Validate The Token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  const user = await User.findById(decodedToken.id);

  if (!user) return next(new customError(401, "The User Is Not Found"));

  if (user.isPasswordChanged(decodedToken.iat))
    return next(
      new customError(
        401,
        "You Have Changed Your Password Later , Please Login Again"
      )
    );

  req.user = user;

  next();
});

// For Permissions Function
export const restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role)
      return next(new customError(403, "You Don't Have permission to do this"));
    next();
  };
};
//? --------------------------End Controllers -------------------
