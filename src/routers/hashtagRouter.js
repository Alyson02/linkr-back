import { Router } from "express";
import { getHashtags, getHashtagPosts } from "../controllers/hashtagController.js";
import authValidation from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.get("/hashtag", authValidation, getHashtags);
router.get("/hashtag/:id", authValidation, getHashtagPosts);

export default router;