import { Router } from "express";
import postRouter from "./postRouter.js";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use(postRouter);
router.use(authRouter);
router.use(userRouter);

export default router;
