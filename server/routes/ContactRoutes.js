import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { seachContacts } from "../controllers/ContactController.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, seachContacts);

export default contactRoutes;