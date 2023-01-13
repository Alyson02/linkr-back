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
        SELECT p.id, p.link, p.content, u."pictureUrl" as "userImage", u.username,
        COUNT(l."postId") as likes, 
        COUNT(c."postId") as comments,
        COUNT(r."postId") as reposts
        FROM posts p
        JOIN users u ON u.id = p."userId"
        left join "postLikes" l on l."postId" = p.id
        left join comments c on c."postId" = p.id
        left join reposts r on r."originalPostId" = p.id
        WHERE u.id=$1
        group by p.id, u.id
        ORDER BY p."createdAt" DESC
        LIMIT $2
        OFFSET $3`,
    [id, limit, offset]
  );
}

export async function validationUserNameQuery(name) {
  return db.query(
    `
        SELECT users.id, users.username, users."pictureUrl", follows."userFollowerId" AS "following"
        FROM users
        FULL OUTER JOIN follows
        ON users.id = follows."userFollowedId"
        WHERE LOWER(users.username) LIKE LOWER($1);
        `,
    [`${name}%`]
  );
}

export async function getFollowQuery(user, id) {
  return db.query(`
    SELECT *
    FROM follows
    WHERE "userFollowerId"=$1
    AND "userFollowedId"=$2
  `, [user.id, id])
}

export async function getFollowedList(id) {
  return db.query(`
    SELECT array_agg("userFollowedId") AS followed
    FROM follows
    WHERE "userFollowerId"=$1
  `, [id])
}

export async function followUserQuery(user, id) {
  return db.query(`
  INSERT INTO follows
  ("userFollowerId", "userFollowedId") VALUES ($1, $2)
  `, [user.id, id])
}

export async function unfollowUserQuery(user, id) {
  return db.query(`
  DELETE FROM follows
  WHERE "userFollowerId"=$1
  AND "userFollowedId"=$2
  `, [user.id, id])
}