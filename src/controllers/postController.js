import { createPost } from "../repositories/postRespository.js";

export async function create(req, res) {
  try {
    const post = req.body;
    post.userId = 1; // res.locals.user.id;
    console.log(post);
    await createPost(post);
    res.send(201);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao criar post",
      exception: error,
    });
  }
}
