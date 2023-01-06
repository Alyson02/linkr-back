import jwt from 'jsonwebtoken';

export async function signIn (req, res) {

    const id = res.locals.userId;
    const key = process.env.JWT_SECRET;
    const token = jwt.sign(id, key);

    try {
        res.status(200).send(token);
    } catch (err) {
        res.status(500).send(err.message);
    }

}