import connectDB from "../db.js";

const db = await connectDB();

export async function createPost(post) {
  await db.query(`INSERT INTO posts VALUES (default, $1, $2, $3)`, [
    post.userId,
    post.link,
    post.content,
  ]);
}

export async function listPostsQuery() {
  return (
    await db.query(`
      SELECT p.id, p.link, p.content, u."pictureUrl" as "userImage", u.username, p."userId", COUNT(l."postId") as likes
      from posts p
      join users u on u.id = p."userId"
      left join "postLikes" l on l."postId" = p.id
      group by p.id, u.id
      order by p."createdAt" desc limit 20`)
  ).rows;
}

export async function getIfPostLikedByUser(postId, userId) {
  return (
    await db.query(
      `SELECT * FROM "postLikes" WHERE "postId" = $1 and "userId" = $2`,
      [postId, userId]
    )
  ).rows;
}

export async function addLike(userId, postId) {
  await db.query(`INSERT INTO "postLikes" VALUES (default, $1, $2)`, [
    userId,
    postId,
  ]);
}

export async function removeLike(userId, postId) {
  await db.query(
    `DELETE FROM "postLikes" WHERE "postId" = $1 and "userId" = $2`,
    [postId, userId]
  );
}

export async function selectUsersLikedPost(postId, userId) {
  return (
    await db.query(
      `
      SELECT u.username, u.id
      FROM "postLikes" l 
      JOIN users u on u.id = l."userId" 
      WHERE l."postId" = $1 and l."userId" <> $2
      LIMIT 2`,
      [postId, userId]
    )
  ).rows;
}

export async function numberLikes(postId, usersId) {
  const offset = 2;
  const placeholders = usersId
    .map(function (u, i) {
      return "$" + (i + offset);
    })
    .join(",");
  return (
    await db.query(
      `SELECT COUNT(*) as "likes" FROM "postLikes" l WHERE l."postId" = $1 and l."userId" not in (${placeholders})`,
      [postId, ...usersId]
    )
  ).rows[0].likes;
}
