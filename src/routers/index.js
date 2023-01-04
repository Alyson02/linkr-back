import { Router } from "express";
import postRouter from "./postRouter.js";

const router = Router();

router.use(postRouter);

export default router;
