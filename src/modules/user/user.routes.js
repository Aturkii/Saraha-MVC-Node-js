import { Router } from "express";
import * as UC from "./user.controller.js";

const userRouter = Router();

userRouter.get("/", UC.index);
userRouter.get("/register", UC.register);
userRouter.get("/login", UC.login);
userRouter.get("/user/:id", UC.user);
userRouter.get("/messages", UC.messages);
userRouter.post("/handleRegister", UC.handleRegister);
userRouter.post("/handleLogin", UC.handleLogin);
userRouter.get("/logout", UC.logOut);

export default userRouter;
