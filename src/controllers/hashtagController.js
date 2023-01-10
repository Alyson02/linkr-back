import { listHashtags, getHashtag, getPostsByHashtag } from "../repositories/hashtagRepository.js";
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
    const { hashtag } = req.params;
    const hashTag = await getHashtag('#'+hashtag);
    if(hashTag.length === 0){
        return res.sendStatus(404);
    }
    else{
        const user = res.locals.user;
        const posts = await getPostsByHashtag(hashTag[0].id);
        return res.status(200).send(await listPostsWithLinkMetadata(user, posts));
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