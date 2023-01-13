import connectDB from "../db.js";

const db = await connectDB();

export async function createPost(post) {
  await db.query(`INSERT INTO posts VALUES (default, $1, $2, $3)`, [
    post.userId,
    post.link,
    post.content,
  ]);
}


export async function listPostsQuery(usersIds, page = 1, limit = 10) {
  const offset = limit * page - limit;
  return (
    await db.query(
      `
      SELECT p.id, p.link, p.content, u."pictureUrl" as "userImage", u.username, p."userId", COUNT(l."postId") as likes, COUNT(c."postId") as comments
      from posts p
      join users u on u.id = p."userId"
      left join "postLikes" l on l."postId" = p.id
      left join comments c on c."postId" = p.id
      where u.id = ANY ($1)
      group by p.id, u.id
      order by p."createdAt" desc limit $2 offset $3`,
      [usersIds, limit, offset]
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

export async function selectUsersFollowing(userId){
  return (
    await db.query(
      `
        SELECT "userFollowerId", string_agg("userFollowedId"::text ,' , ') as followeds  FROM follows f
        JOIN users u ON u.id = f."userFollowedId"
        WHERE f."userFollowerId" = $1
        group by "userFollowerId" ;
      `,
      [userId]
    )
  ).rows[0]?.followeds;
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

export async function getLasPostByUser(userId) {
  return await (
    await db.query(
      `SELECT id FROM posts WHERE "userId" = $1 ORDER BY id DESC LIMIT 1`,
      [userId]
    )
  ).rows[0];
}

export async function getCommentList(postId) {
  return db.query(`
    SELECT c.comment, u.id as "userId", u.username, u."pictureUrl"
    FROM comments c
    JOIN users u
      ON u.id=c."userId"
    WHERE c."postId"=$1
    ORDER BY c.id ASC
  `, [postId])
}

export async function postCommentQuery(postId, user, comment) {
  return db.query(
    `
  INSERT INTO comments (comment, "postId", "userId") VALUES ($1, $2, $3)
  `,
    [comment, postId, user.id]
  );
}
