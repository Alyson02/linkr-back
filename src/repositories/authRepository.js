import { connection } from "../database/database.js";

async function findUser(email) {
	return connection.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
}

async function signIn(
    token,
    id
) {
	return connection.query(
        "INSERT INTO sessions (token, user_id) VALUES ($1, $2);",
        [token, id]
    );
}

export const authRepository = {
    findUser,
    signIn
}