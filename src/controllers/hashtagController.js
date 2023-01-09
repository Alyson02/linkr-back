import { getHashtag, listHashtags } from "../repositories/hashtagRepository.js";

export async function getHashtagList(req, res) {
  try {
    const hashtagList = await listHashtags();
    res.status(200).send(hashtagList.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getPostsByHashtag(req, res) {
  try {
    const { hashtag } = req.params;
    const hashTag = await getHashtag(hashtag);
    if(hashTag.length === 0){
        return res.sendStatus(404);
    }
    else{
        const posts = await getPostsByHashtag(hashTag.id);
        res.status(200).send(posts);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erro ao interagir com o post",
      exception: error,
    });
  }
}