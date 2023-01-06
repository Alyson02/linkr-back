import { validationUserQuery } from "../repositories/userRepository.js";

export async function validationUser(req, res, next) {

    const { id } = req.params

    try {

        const result = (await validationUserQuery(id)).rows

        if (result.length === 0) {
            res.sendStatus(404)
            return
        }

        res.locals.user = result[0]
        console.log(result[0])
        next()

    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Erro ao buscar usuário",
            exception: err
        });
    }

}