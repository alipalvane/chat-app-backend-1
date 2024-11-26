import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  seachContacts,
  seachContactsDM,
  getAllContacts,
} from "../controllers/ContactController.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, seachContacts);
contactRoutes.get("/search-contact-dm", verifyToken, seachContactsDM);
contactRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default contactRoutes;
