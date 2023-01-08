import connectDB from "../db.js";
const db = await connectDB();

export async function insertHashTag(hashtag) {
  await db.query(`INSERT INTO hashtags VALUES(default, $1)`, [hashtag]);
}
export async function getHashtag(hashtag) {
  return (await db.query(`SELECT * FROM hashtags WHERE name = $1`,[hashtag])).rows;
}

export async function getPostsByHashtag(hashtagId){
  return (await db.query('SELECT p.* FROM posts JOIN "postHashtags" ph ON p.id = ph."postId" WHERE ph."hashtagId" = $1',[hashtagId])).rows;
}