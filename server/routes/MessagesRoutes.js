import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages } from "../controllers/MessagesController.js";

const MessagesRoutes = Router();

MessagesRoutes.post("/get-messages", verifyToken, getMessages);

export default MessagesRoutes;