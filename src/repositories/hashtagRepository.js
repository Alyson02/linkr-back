import connectDB from "../db.js";
const db = await connectDB();

export async function insertHashTag(hashtag) {
  await db.query(`INSERT INTO hashtags VALUES(default, $1)`, [hashtag]);
}
