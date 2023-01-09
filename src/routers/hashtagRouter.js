import { Router } from "express";
import { getHashtagList, getPostsByHashtag } from "../controllers/hashtagController.js";
import authValidation from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.get("/hashtag", authValidation, getHashtagList);
router.get("/hashtag/:id", authValidation, getPostsByHashtag);

export default router;