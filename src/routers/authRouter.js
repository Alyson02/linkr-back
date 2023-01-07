import { Router } from "express";
import { signIn, signup } from "../controllers/authController.js";
import { signInModelValidation } from "../middlewares/authValidationMiddleware.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import models from "../models/index.js";

const router = Router();

router.post("/signin", signInModelValidation, signIn);
router.post("/signup", validationMiddleware(models.signupPOST), signup);

export default router;
