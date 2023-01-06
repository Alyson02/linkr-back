import { v4 as uuid } from "uuid";
import { authRepository } from "../repositories/authRepository.js";

export async function signIn (req, res) {

    const id = res.locals.userId;
    const token = uuid();

    try {
        await authRepository.signIn(token, id);
        res.status(200).send(token);
    } catch (err) {
        res.status(500).send(err.message);
    }

}