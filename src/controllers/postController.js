import urlMetadata from "url-metadata";
import { insertHashTag } from "../repositories/hashtagRepository.js";
import { createPost, listPosts } from "../repositories/postRespository.js";

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

        postsWithLinkMetaDatas.push({
          ...p,
          link: {
            url,
            ...metadata,
            success: true,
          },
        });
      } catch (error) {
        postsWithLinkMetaDatas.push({ ...p, link: { url, success: false } });
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
