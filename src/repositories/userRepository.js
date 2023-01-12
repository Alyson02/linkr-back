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

export async function getUserQuery(id) {
  return db.query(
    `
        SELECT p.id, p.link, p.content, u."pictureUrl" as "userImage", u.username
        FROM posts p
        JOIN users u ON u.id = p."userId"
        WHERE u.id=$1
        ORDER BY p."createdAt" DESC`,
    [id]
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

export async function getFollowQuery(user, id) {
  return db.query(`
    SELECT *
    FROM follows
    WHERE "userFollowingId"=$1
    AND "userFollowedId"=$2
  `, [user.id, id])
}

export async function followUserQuery(user, id) {
  return db.query(`
  INSERT INTO follows
  ("userFollowingId", "userFollowedId") VALUES ($1, $2)
  `, [user.id, id])
}

export async function unfollowUserQuery(user, id) {
  return db.query(`
  DELETE FROM follows
  WHERE "userFollowingId"=$1
  AND "userFollowedId"=$2
  `, [user.id, id])
}