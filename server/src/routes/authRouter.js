import { Router } from "express";
import { login, signup } from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);

export default authRouter;
