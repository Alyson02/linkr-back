import { Router } from "express";
import { create, list } from "../controllers/postController.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import models from "../models/index.js";

const postRouter = Router();

postRouter.post("/add-post", validationMiddleware(models.postPOST), create);
postRouter.get("/posts", list);

export default postRouter;
