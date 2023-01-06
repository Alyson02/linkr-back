import connectDB from "../db.js";


async function findUser(email) {
	return connectDB().query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
}

export const authRepository = {
    findUser
}