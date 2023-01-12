import { Router } from "express";
import { getHashtagList, getHashtagPost } from "../controllers/hashtagController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/hashtag", authMiddleware, getHashtagList);
router.get("/hashtag/:hashtag", authMiddleware, getHashtagPost);

export default router;