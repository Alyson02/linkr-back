import urlMetadata from "url-metadata";
import { insertHashTag } from "../repositories/hashtagRepository.js";
import {
  addLike,
  createPost,
  getIfPostLikedByUser,
  listPosts,
  removeLike,
} from "../repositories/postRespository.js";

export async function create(req, res) {
  try {
    const post = req.body;
    post.userId = 1; // res.locals.user.id;

    var regexp = /\B\#\w\w+\b/g;
    const hashtags = post.content.match(regexp);

    if (hashtags) {
      hashtags.forEach(async (h) => {
        await insertHashTag(h);
      });
    }

    await createPost(post);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao criar post",
      exception: error,
    });
  }
}

export async function list(req, res) {
  try {
    const posts = await listPosts();

    const postsWithLinkMetaDatas = [];
    for (let p of posts) {
      const metadata = {};
      const url = p.link;
      delete p.link;

      try {
        const res = await urlMetadata(url);

        metadata.title = res.title;
        metadata.description = res.description;
        metadata.image = res.image;

        const liked = (await getIfPostLikedByUser(p.id, p.userId)).length > 0;

        postsWithLinkMetaDatas.push({
          ...p,
          liked,
          link: {
            url,
            ...metadata,
            success: true,
          },
        });
      } catch (error) {
        postsWithLinkMetaDatas.push({
          ...p,
          link: { url, success: false, liked },
        });
      }
    }

    res.send(postsWithLinkMetaDatas);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao listar posts",
      exception: error,
    });
  }
}

export async function likeOrDislike(req, res) {
  try {
    const { postId } = req.params;
    const userId = 1; //res.locals.user.id;

    const liked = await getIfPostLikedByUser(postId, userId);

    if (liked.length === 0) {
      await addLike(userId, postId);
    } else {
      await removeLike(userId, postId);
    }

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao interagir com o post",
      exception: error,
    });
  }
}
