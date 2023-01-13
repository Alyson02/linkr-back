import { validationUserNameQuery, validationUserQuery } from "../repositories/userRepository.js";

export async function validationUser(req, res, next) {

    const { id } = req.params

    try {

        const result = (await validationUserQuery(id)).rows

        if (result.length === 0) {
            res.sendStatus(404)
            return
        }

        res.locals.user = result[0]

        next()

    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Erro ao buscar usuário",
            exception: err
        });
    }

}

export async function validationUserName(req, res, next) {

    let { name } = req.params

    let { user } = res.locals

    try {

        let result = (await validationUserNameQuery(name, user)).rows

        function compare (a, b) {
            if (a.following > b.following)
                return -1;
            if (a.following < b.following)
                return 1;
            return 0;
        }

        result.sort(compare);

        if (result.length === 0) {
            res.sendStatus(404)
            return
        }

        res.locals.users = result

        next()

    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Erro ao buscar usuários",
            exception: err
        });
    }

}