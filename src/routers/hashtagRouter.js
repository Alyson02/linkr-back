import { Router } from "express";
import { getHashtag } from "../controllers/hashtagController.js";
import authValidation from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.get("/hashtag", authValidation, getHashtag);

export default router;