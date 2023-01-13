import { Router } from "express";
import { followUser, getFollow, getFollowList, getUser, searchUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validationUser, validationUserName } from "../middlewares/userMiddleware.js";

const router = Router()

router.get('/user/:id', authMiddleware, validationUser, getUser)
router.get('/user/search/:name', authMiddleware, validationUserName, searchUser)

router.post('/user/follow/:id', authMiddleware, followUser)
router.get('/user/follow/:id', authMiddleware, getFollow)
router.get('/followList', authMiddleware, getFollowList)

export default router