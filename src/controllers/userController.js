import { followUserQuery, getFollowQuery, getUserQuery, unfollowUserQuery } from "../repositories/userRepository.js";
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

export async function followUser(req, res) {

  const { user } = res.locals

  const { id } = req.params

  try {

    const follow = (await getFollowQuery(user, id)).rows

    if (follow.length === 0) {
      await followUserQuery(user, id)
    } else {
      await unfollowUserQuery(user, id)
    }

    res.sendStatus(200)

  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Erro ao seguir usuário",
      exception: err,
    });
  }

}

export async function getFollow(req, res) {

  const { user } = res.locals

  const { id } = req.params

  let resultado

  try {

    const follow = (await getFollowQuery(user, id)).rows

    if (follow.length === 0) {
      resultado = false
    } else {
      resultado = true
    }

    res.status(200).send({ follow: resultado })

  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Erro ao verificar se o usuário é seguido",
      exception: err,
    });
  }

}