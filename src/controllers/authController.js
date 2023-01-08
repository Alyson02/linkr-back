import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../repositories/authRepository.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export async function signIn(req, res) {
  try {
    const user = res.locals.user;
    const key = process.env.SECRET;
    const token = jwt.sign({ id: user.id }, key);
    res.status(200).send({ token, user });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function signup(req, res) {
  try {
    const body = req.body;

    const hasUserWithEmail = await getUserByEmail(body.email);

    if (hasUserWithEmail) return res.sendStatus(409);

    const passwordHash = bcrypt.hashSync(body.password, 10);

    await createUser({ ...body, password: passwordHash });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erro ao cadastrar",
      exception: error,
    });
  }
}
