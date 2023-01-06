import bcrypt from "bcrypt";
import { signInModel } from "../models/authModel.js";
import { authRepository } from "../repositories/authRepository.js";

export async function signInModelValidation(req, res, next) {

    const {
        email,
        password
    } = req.body;

    const user = {
        email,
        password
    };

    const { error } = signInModel.validate(user, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const userExists = await authRepository.findUser(email);
        if(userExists && bcrypt.compareSync(user.password, userExists.rows[0].password)){
            delete userExists.password;
            res.locals.userId = userExists.rows[0].id;
        } else {
            return res.sendStatus(401);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }

    next();

}