import urlMetadata from "url-metadata";
import { createPost, listPosts } from "../repositories/postRespository.js";

export async function create(req, res) {
  try {
    const post = req.body;
    post.userId = 1; // res.locals.user.id;
    console.log(post);
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

    const postsWithLinkMetaDatasUnresolved = posts.map(async (p) => {
      const metadata = {};

      const res = await urlMetadata(p.link);

      metadata.title = res.title;
      metadata.description = res.description;
      metadata.image = res.image;
      const url = p.link;
      delete p.link;

      return {
        ...p,
        link: {
          url,
          ...metadata,
        },
      };
    });

    const postsWithLinkMetaDatas = await Promise.all(
      postsWithLinkMetaDatasUnresolved
    );

    res.send(postsWithLinkMetaDatas);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao criar post",
      exception: error,
    });
  }
}
