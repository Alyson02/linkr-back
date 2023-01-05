import connectDB from "../db.js";

const db = await connectDB();

export async function createPost(post) {
  await db.query(`INSERT INTO posts VALUES (default, $1, $2, $3)`, [
    post.userId,
    post.link,
    post.content,
  ]);
}

export async function listPosts() {
  return (
    await db.query(`
      SELECT p.id, p.link, p.content, u."pictureUrl" as "userImage", u.username
      from posts p
      join users u on u.id = p."userId"
      order by p."createdAt" desc limit 20`)
  ).rows;
}
