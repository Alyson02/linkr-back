import connectDB from "../db.js";
const db = await connectDB();

export async function findUser(email) {
  return await db.query("SELECT * FROM users WHERE email=$1", [email]);
}

export async function getUserByEmail(email) {
  return (await db.query("SELECT * FROM users WHERE email = $1", [email]))
    .rows[0];
}

export async function createUser(user) {
  await db.query("INSERT INTO users VALUES(DEFAULT, $1, $2, $3, $4)", [
    user.username,
    user.password,
    user.pictureUrl,
    user.email,
  ]);
}
