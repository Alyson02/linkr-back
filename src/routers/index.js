import { Router } from "express";
import postRouter from "./postRouter.js";
import userRouter from './userRouter.js'

const router = Router();

router.use(postRouter);
router.use(userRouter)

export default router;
