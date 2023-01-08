import bcrypt from "bcrypt";
import { signInModel } from "../models/authModel.js";
import { findUser } from "../repositories/authRepository.js";
import { validationUserQuery } from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export async function signInModelValidation(req, res, next) {
  const { email, password } = req.body;

  const { error } = signInModel.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const { rows: users } = await findUser(email);
    const [user] = users;
    if (!user) {
      return res.sendStatus(401);
    }
    if (bcrypt.compareSync(password, user.password)) {
      delete user.password;
      res.locals.user = user;
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

  next();
}

export default function authValidation(req, res, next) {

    const { authorization } = req.headers

    if (!authorization) {
        return res.sendStatus(401)
    }

    const tokenParts = authorization.split(' ')

    if (tokenParts.length !== 2) {
        return res.status(401).send({ message: 'Token inválido' })
    }

    const [scheme, token] = tokenParts

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ message: 'Token deve ser do tipo Bearer' })
    }

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {

        if (err) {
            console.error(err);
            return res.status(401).send({ message: 'Token inválido' })
        }

        const user = (await validationUserQuery(decoded.id)).rows

        if (user.length === 0) {
            return res.status(401).send({ message: 'Token inválido' })
        }

        next()
    });
}
