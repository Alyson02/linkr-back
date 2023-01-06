import {
  getIfPostLikedByUser,
  listPostsQuery,
} from "../repositories/postRespository.js";
import urlMetadata from "url-metadata";

export async function listPostsWithLinkMetadata(user, posts) {
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

      const liked = (await getIfPostLikedByUser(p.id, user.id)).length > 0;

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

  return postsWithLinkMetaDatas;
}
