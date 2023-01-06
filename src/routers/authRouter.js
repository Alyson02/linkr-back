import { Router } from "express";
import { signIn } from "../controllers/authController.js"
import validationMiddleware from "../middlewares/validationMiddleware.js";
import models from "../models/index.js";

const router = Router();

router.post("/signin", validationMiddleware(models.signInPOST), signIn);

export default router;