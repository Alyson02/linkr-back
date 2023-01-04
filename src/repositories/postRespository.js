import connectDB from "../db.js";

const db = await connectDB();

export async function createPost(post) {
  try {
    const query = await db.query(
      `INSERT INTO posts VALUES (default, $1, $2, $3)`,
      [post.userId, post.link, post.content]
    );

    console.log(query);
  } catch (error) {
    console.log(error);
  }
}
