import { Router } from "express";
import { create, delPost, likeOrDislike, list } from "../controllers/postController.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import models from "../models/index.js";

const postRouter = Router();

postRouter.post("/add-post", validationMiddleware(models.postPOST), create);
postRouter.get("/posts", list);
postRouter.post("/like-or-dislike/:postId", likeOrDislike);
postRouter.delete("/post/:id", delPost);

export default postRouter;
