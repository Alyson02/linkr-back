import { Router } from "express";
import { getUser, searchUser } from "../controllers/userController.js";
import authValidation from "../middlewares/authValidationMiddleware.js";
import { validationUser, validationUserName } from "../middlewares/userMiddleware.js";

const router = Router()

router.get('/user/:id', authValidation, validationUser, getUser)
router.get('/user/search/:name', authValidation, validationUserName, searchUser)

export default router