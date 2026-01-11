import { Router } from "express";
import * as controller from "../controllers/internalController.js";
import { reputationAuth } from "../middlewares/reputationMiddleware.js";

const router = Router();

router.patch(
  "/users/:id/reputation",
  reputationAuth,
  controller.updateReputation
);

export default router;
