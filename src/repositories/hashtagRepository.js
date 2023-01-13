import connectDB from "../db.js";
const db = await connectDB();

export async function listHashtags(page = 1, limit = 10) {
  return db.query(`
    SELECT
      h.name,
      COUNT(p."hashId") as "hashtag"
    FROM
      "postsHashtags" p
    JOIN
      hashtags h
      ON
        h.id=p."hashId"
    GROUP BY
      h.name
    ORDER BY
      hashtag DESC
    LIMIT
      10
  `);
}

export async function insertHashTag(hashtag) {
  await db.query(`INSERT INTO hashtags VALUES(default, $1)`, [hashtag]);
}
export async function getHashtag(hashtag) {
  return (await db.query(`SELECT * FROM hashtags WHERE name = $1`, [hashtag]))
    .rows;
}

export async function getPostsByHashtag(hashtagId, page, limit) {
  const offset = limit * page - limit;
  return (
    await db.query(
      `SELECT p.id, p.link, p.content, u."pictureUrl" as "userImage", u.username, p."userId", COUNT(l."postId") as likes, COUNT(c."postId") as comments, COUNT(r."postId") as reposts
      from posts p
      JOIN "postsHashtags" ph ON p.id = ph."postId"
      join users u on u.id = p."userId"
      left join "postLikes" l on l."postId" = p.id
      left join comments c on c."postId" = p.id
      left join reposts r on r."originalPostId" = p.id
      WHERE ph."hashId" = $1
      group by p.id, u.id
      order by p."createdAt" desc LIMIT $2 OFFSET $3`,
      [hashtagId, limit, offset]
    )
  ).rows;
}

export async function removeHashtagsFromPost(postId) {
  await db.query('DELETE FROM "postsHashtags" ph WHERE ph."postId" = $1', [
    postId,
  ]);
}

export async function findHashtag(hashtagName) {
  return (
    await db.query("SELECT * FROM hashtags h WHERE h.name = $1", [hashtagName])
  ).rows[0];
}

export async function insertPostHashtag(postId, hashtagId) {
  await db.query(`INSERT INTO "postsHashtags" VALUES(default, $1,$2)`, [
    postId,
    hashtagId,
  ]);
}
