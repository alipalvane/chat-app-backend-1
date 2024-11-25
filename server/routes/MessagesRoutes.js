import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFiles } from "../controllers/MessagesController.js";
import multer from "multer";

const MessagesRoutes = Router();
const upload = multer({ dest: "uploads/files" });

MessagesRoutes.post("/get-messages", verifyToken, getMessages);
MessagesRoutes.post("/upload-file", verifyToken, upload.single("file"),uploadFiles);

export default MessagesRoutes;
