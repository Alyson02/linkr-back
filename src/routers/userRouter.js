import { Router } from "express";
import { getUser } from "../controllers/userController.js";
import { validationUser } from "../middlewares/userMiddleware.js";

const router = Router()

router.get('/user/:id', validationUser, getUser)

export default router