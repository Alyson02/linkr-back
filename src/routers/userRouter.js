import { Router } from "express";
import { getUser, searchUser } from "../controllers/userController.js";
import { validationUser, validationUserName } from "../middlewares/userMiddleware.js";

const router = Router()

router.get('/user/:id', validationUser, getUser)
router.get('/user/search/:name', validationUserName, searchUser)

export default router