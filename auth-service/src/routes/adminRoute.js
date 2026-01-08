import express from "express";
import { getAllUsers, changeUserRole } from "../controllers/adminController.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get("/users", getAllUsers);
router.patch("/users/:id/role", changeUserRole);

export default router;
