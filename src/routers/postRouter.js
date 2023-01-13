import { Router } from "express";
import { getHashtagPost } from "../controllers/hashtagController.js";
import {
  create,
  likeOrDislike,
  list,
  delPost,
  editPost,
  postComment,
  repost,
  getComment,
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
postRouter.get("/hashtag/:hashtag", getHashtagPost);
postRouter.delete("/post/:id", authMiddleware, delPost);
postRouter.put("/post/:postId", authMiddleware, editPost);
postRouter.post("/posts/repost/:postId", authMiddleware, repost);
postRouter.get('/post/comment/:id', authMiddleware, getComment);
postRouter.post('/post/comment/:id', authMiddleware, validationMiddleware(models.commentPOST), postComment);

export default postRouter;
