import {
  listHashtags,
  getHashtag,
  getPostsByHashtag,
} from "../repositories/hashtagRepository.js";
import { selectUsersFollowing } from "../repositories/postRespository.js";
import { listPostsWithLinkMetadata } from "../services/postService.js";

export async function getHashtagList(req, res) {
  try {
    const hashtagList = await listHashtags();
    res.status(200).send(hashtagList.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getHashtagPost(req, res) {
  try {
    const user = res.locals.user;
    const { hashtag } = req.params;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    let following = await selectUsersFollowing(user.id);

    if (following === undefined) following = "";

    following = JSON.parse("[" + following + "]");

    const hashTag = await getHashtag("#" + hashtag);
    if (hashTag.length === 0) {
      return res.sendStatus(404);
    } else {
      const user = res.locals.user;
      const posts = await getPostsByHashtag(hashTag[0].id, page, limit);
      return res.status(200).send({
        posts: await listPostsWithLinkMetadata(user, posts),
        following,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erro ao interagir com o post",
      exception: error,
    });
  }
}
