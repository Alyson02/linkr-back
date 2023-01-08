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
      ON h.id=p."hashId"
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