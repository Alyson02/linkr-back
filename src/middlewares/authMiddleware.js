import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { validationUserQuery } from "../repositories/userRepository.js";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Token não informado!" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).send({ message: "Token invalido!" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ message: "Token deve ser do tipo Bearer" });
  }

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).send({ message: "Token invalido!" });
    }

    const user = (await validationUserQuery(decoded.id)).rows[0];

    if (!user) {
      return res.status(401).send({ message: "Token invalido!" });
    }

    res.locals.user = user;

    return next();
  });
}
