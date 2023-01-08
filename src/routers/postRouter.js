import { Router } from "express";
import { getPostsByHashtag } from "../controllers/hashtagController.js";
import {
  create,
  likeOrDislike,
  list,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import models from "../models/index.js";

const postRouter = Router();

postRouter.post(
  "/add-post",
  authMiddleware,
  validationMiddleware(models.postPOST),
  create
);
postRouter.get("/posts", authMiddleware, list);
postRouter.post("/like-or-dislike/:postId", authMiddleware, likeOrDislike);
postRouter.get("/hashtag/:hashtag",getPostsByHashtag);

export default postRouter;
