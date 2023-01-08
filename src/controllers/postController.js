import { query } from "express";
import urlMetadata from "url-metadata";
import { insertHashTag } from "../repositories/hashtagRepository.js";
import {
  addLike,
  createPost,
  getIfPostLikedByUser,
  listPostsQuery,
  numberLikes,
  removeLike,
  findPost,
  deletePost,
  removeAllLikes,
  selectUsersLikedPost
} from "../repositories/postRespository.js";
import { listPostsWithLinkMetadata } from "../services/postService.js";

export async function create(req, res) {
  try {
    const post = req.body;
    post.userId = res.locals.user.id;

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

export async function delPost(req, res) {
  try {
    let {id} = req.params;
    let userId = 2//TERMINAR APÓS A CRIAÇÃO DA AUTENTICAÇÃO
    let query = await findPost(id)

    if(query.length===0){
      res.sendStatus(404);
    }
    else if(userId !== query[0].userId){
      res.sendStatus(401);
    }
    else{
      await removeAllLikes(id);
      await deletePost(id);
      res.sendStatus(200);
    }

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Erro ao deletar post",
      exception: error,
    });
  }
}

export async function list(req, res) {
  try {
    const user = res.locals.user;
    const posts = await listPostsQuery();
    res.send(await listPostsWithLinkMetadata(user, posts));
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
    const userId = res.locals.user.id;

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
