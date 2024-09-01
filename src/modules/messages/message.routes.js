import { Router } from "express";
import { sendMessage } from './message.controller.js';

const messageRouter = Router();

messageRouter.post("/sendMessage/:id", sendMessage);

export default messageRouter;
