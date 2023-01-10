import { Router } from "express";
import { getHashtagList, getHashtagPost } from "../controllers/hashtagController.js";
import authValidation from "../middlewares/authValidationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/hashtag", authValidation, getHashtagList);
router.get("/hashtag/:hashtag", authMiddleware, getHashtagPost);

export default router;