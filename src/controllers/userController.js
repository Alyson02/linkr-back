import { getUserQuery } from "../repositories/userRepository.js";
import { listPostsWithLinkMetadata } from "../services/postService.js";

export async function getUser(req, res) {
  try {
    const { id } = req.params;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const { user } = res.locals;
    console.log(user);

    const posts = (await getUserQuery(id, page, limit)).rows;

    const postsWithLinkMetaData = await listPostsWithLinkMetadata(user, posts);

    res.send({ user, posts: postsWithLinkMetaData });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Erro ao buscar posts do usuário",
      exception: err,
    });
  }
}

export function searchUser(req, res) {
  const { users } = res.locals;

  res.send(users);
}
