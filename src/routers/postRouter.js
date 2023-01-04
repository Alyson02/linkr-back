import { Router } from "express";
import { create } from "../controllers/postController.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import models from "../models/index.js";

const postRouter = Router();

postRouter.post("/add-post", validationMiddleware(models.postPOST), create);

export default postRouter;
