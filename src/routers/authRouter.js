import { Router } from "express";
import { signIn } from "../controllers/authController.js"
import { signInModelValidation } from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.post("/signin", signInModelValidation, signIn);

export default router;