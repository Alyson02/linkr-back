import connectDB from "../db.js";

const db = await connectDB();

export async function validationUserQuery(id) {
  return db.query(
    `
        SELECT *
        FROM users
        WHERE id=$1`,
    [id]
  );
}

export async function getUserQuery(id, page = 1, limit = 10) {
  const offset = limit * page - limit;
  return db.query(
    `
        SELECT p.id, p.link, p.content, u."pictureUrl" as "userImage", u.username
        FROM posts p
        JOIN users u ON u.id = p."userId"
        WHERE u.id=$1
        ORDER BY p."createdAt" DESC
        LIMIT $2
        OFFSET $3`,
    [id, limit, offset]
  );
}

export async function validationUserNameQuery(name) {
  return db.query(
    `
        SELECT *
        FROM users
        WHERE LOWER(username) LIKE LOWER($1)
        `,
    [`${name}%`]
  );
}
