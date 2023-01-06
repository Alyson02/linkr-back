import { connection } from "../database/database.js";

async function findUser(email) {
	return connection.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
}

export const authRepository = {
    findUser
}