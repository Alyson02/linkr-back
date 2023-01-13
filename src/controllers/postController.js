import {
  insertHashTag,
  removeHashtagsFromPost,
  findHashtag,
  insertPostHashtag,
} from "../repositories/hashtagRepository.js";
import {
  addLike,
  createPost,
  getIfPostLikedByUser,
  listPostsQuery,
  removeLike,
  findPost,
  deletePost,
  removeAllLikes,
  updatePost,
  selectUsersLikedPost,
  getLastPostByUser,
  postCommentQuery,
  insertRepost,
  getCommentList,
  selectUsersFollowing,
  countPosts,
} from "../repositories/postRespository.js";
import { listPostsWithLinkMetadata } from "../services/postService.js";

export async function create(req, res) {
  try {
    const post = req.body;
    post.userId = res.locals.user.id;

    var regexp = /\B\#\w\w+\b/g;
    const hashtags = post.content.match(regexp);

    await createPost(post);
    const lasPostByUser = await getLastPostByUser(res.locals.user.id);

    if (hashtags) {
      for (let h of hashtags) {
        let hashtagExist = await findHashtag(h);

        if (hashtagExist) {
          await insertPostHashtag(lasPostByUser.id, hashtagExist.id);
          continue;
        } else {
          await insertHashTag(h);
          let hashTagInserted = await findHashtag(h);
          await insertPostHashtag(lasPostByUser.id, hashTagInserted.id);
        }
      }
    }

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
    let { id } = req.params;
    let userId = res.locals.user.id;
    let query = await findPost(id);

    if (query.length === 0) {
      res.sendStatus(404);
    } else if (userId !== query[0].userId) {
      res.sendStatus(401);
    } else {
      await removeAllLikes(id);
      await deletePost(id);
      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
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

    let following = await selectUsersFollowing(user.id);
    following = JSON.parse("[" + following + "]");
    let arr = following;
    arr.push(user.id);
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const posts = await listPostsQuery(arr, page, limit);
    res.send({
      posts: await listPostsWithLinkMetadata(user, posts),
      following: following,
    });
  } catch (error) {
    console.log(error);
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

export async function editPost(req, res) {
  try {
    const { postId } = req.params;
    let userId = res.locals.user.id;
    let content = req.body.content === undefined ? "" : req.body.content;
    const post = await findPost(postId);

    if (post.length === 0) {
      res.sendStatus(404);
    } else if (userId !== post[0].userId) {
      res.sendStatus(401);
    } else {
      await removeHashtagsFromPost(postId);

      var regexp = /\B\#\w\w+\b/g;
      const hashtags = content.match(regexp);

      if (hashtags) {
        hashtags.forEach(async (h) => {
          let hashtag = await findHashtag(h);
          if (hashtag.length === 0) {
            await insertHashTag(h);
            hashtag = await findHashtag(h);
          }

          await insertPostHashtag(postId, hashtag[0].id);
        });
      }
      await updatePost(postId, content);

      res.sendStatus(202);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erro ao editar post",
      exception: error,
    });
  }
}

export async function getComment(req, res) {
  const { id } = req.params;

  try {
    const post = await findPost(id);

    if (post.length === 0) {
      return res.sendStatus(404);
    } else {
      const commentList = await getCommentList(id);
      res.status(200).send(commentList.rows);
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Erro ao obter comentário",
      exception: err,
    });
  }
}

export async function postComment(req, res) {
  const { user } = res.locals;
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const post = await findPost(id);

    if (post.length === 0) {
      return res.sendStatus(404);
    } else {
      await postCommentQuery(id, user, comment);
      res.sendStatus(200);
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Erro ao postar comentário",
      exception: err,
    });
  }
}

export async function repost(req, res) {
  try {
    const { user } = res.locals;
    const { postId } = req.params;

    const originalPost = (await findPost(postId))[0];
    originalPost.userId = user.id;
    await createPost(originalPost);
    const newPost = await getLastPostByUser(user.id);

    await insertRepost(originalPost.id, newPost.id, user.id);

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao realizar repost",
      exception: err,
    });
  }
}

export async function count(req, res) {
  try {
    const numPosts = await countPosts();
    return res.status(200).send({ numPosts: numPosts.rows[0].num });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Erro ao pegar numero de posts",
      exception: err,
    });
  }
}
