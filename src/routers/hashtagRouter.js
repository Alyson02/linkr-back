import { Router } from "express";
import { getHashtagList, getHashtagPost } from "../controllers/hashtagController.js";
import authValidation from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.get("/hashtag", authValidation, getHashtagList);
router.get("/hashtag/:id", authValidation, getHashtagPost);

export default router;