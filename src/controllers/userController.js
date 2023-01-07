import urlMetadata from "url-metadata";
import { getUserQuery } from "../repositories/userRepository.js";

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    const { user } = res.locals;

    const posts = (await getUserQuery(id)).rows;

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

    res.send({ user, posts: postsWithLinkMetaDatas });
  } catch (err) {
    console.log(err);
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
