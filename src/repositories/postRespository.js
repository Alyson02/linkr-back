import connectDB from "../db.js";

const db = await connectDB();

export async function createPost(post) {
  await db.query(`INSERT INTO posts VALUES (default, $1, $2, $3)`, [
    post.userId,
    post.link,
    post.content,
  ]);
}

export async function listPostsQuery(page = 1, limit = 10) {
  const offset = limit * page - limit;
  return (
    await db.query(`
      SELECT 
        p.id, p.link,
        p.content,
        u."pictureUrl" as "userImage", 
        u.username, 
        p."userId", 
        COUNT(l."postId") as likes, 
        COUNT(c."postId") as comments,
        COUNT(r."postId") as reposts
      from posts p
      join users u on u.id = p."userId"
      left join "postLikes" l on l."postId" = p.id
      left join comments c on c."postId" = p.id
      left join reposts r on r."postId" = p.id
      group by p.id, u.id
      order by p."createdAt" desc limit $1 offset $2`,
      [limit, offset]
    )
  ).rows;
}
export async function findPost(postId) {
  return (
    await db.query(
      `
      SELECT * FROM posts
      WHERE id = $1
      `,
      [postId]
    )
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

export async function removeAllLikes(postId) {
  await db.query(`DELETE FROM "postLikes" WHERE "postId" = $1`, [postId]);
}

export async function deletePost(postId) {
  await db.query(`DELETE FROM "posts" WHERE id = $1`, [postId]);
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

export async function updatePost(postId, content) {
  await db.query(`UPDATE "posts" p SET content = $1 WHERE p.id = $2`, [
    content,
    postId,
  ]);
}

export async function getLastPostByUser(userId) {
  return await (
    await db.query(
      `SELECT id FROM posts WHERE "userId" = $1 ORDER BY id DESC LIMIT 1`,
      [userId]
    )
  ).rows[0];
}

export async function postCommentQuery(postId, user, comment) {
  return db.query(
    `
  INSERT INTO comments (comment, "postId", "userId") VALUES ($1, $2, $3)
  `,
    [comment, postId, user.id]
  );
}

export async function insertRepost(orginalPostId, postId, userId) {
  await db.query(`INSERT INTO reposts values (default, $1, $2, $3)`, [
    postId,
    userId,
    orginalPostId,
  ]);
}

export async function getIfPostIsRepost(postId, userId) {
  return (
    await db.query(
      `SELECT * FROM reposts WHERE "postId" = $1 and "userId" = $2`,
      [postId, userId]
    )
  ).rows;
}
