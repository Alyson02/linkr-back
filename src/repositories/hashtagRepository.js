import connectDB from "../db.js";
const db = await connectDB();

export async function listHashtags() {
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

export async function listHashtagPosts(id) {
  return db.query(
    `
    SELECT
      p.id,
      p.link,
      p.content,
      u."pictureUrl" as "userImage",
      u.username, p."userId",
      COUNT(l."postId") as likes
    FROM
      "postsHashtags" h
    LEFT JOIN
      posts p
      ON
        p.id = h."postId"
    JOIN
      users u
      ON
        u.id = p."userId"
    LEFT JOIN
      "postLikes" l
      ON
        l."postId" = p.id
    WHERE
      h."hashId"=$1
    GROUP BY
      p.id, u.id
    ORDER BY
      p."createdAt" DESC
  `,
    [id]
  );
}

export async function insertHashTag(hashtag) {
  await db.query(`INSERT INTO hashtags VALUES(default, $1)`, [hashtag]);
}
export async function getHashtag(hashtag) {
  return (await db.query(`SELECT * FROM hashtags WHERE name = $1`, [hashtag]))
    .rows;
}

export async function getPostsByHashtag(hashtagId) {
  return (
    await db.query(
      `SELECT p.id, p.link, p.content, u."pictureUrl" as "userImage", u.username, p."userId", COUNT(l."postId") as likes
      from posts p
      JOIN "postsHashtags" ph ON p.id = ph."postId"
      join users u on u.id = p."userId"
      left join "postLikes" l on l."postId" = p.id
      WHERE ph."hashId" = $1
      group by p.id, u.id
      order by p."createdAt" desc limit 20`,
      [hashtagId]
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
