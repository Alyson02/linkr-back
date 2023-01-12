import {
  getIfPostLikedByUser,
  selectUsersLikedPost,
} from "../repositories/postRespository.js";
import urlMetadata from "url-metadata";

export async function listPostsWithLinkMetadata(user, posts) {
  const postsWithLinkMetaDatas = [];

  for (let p of posts) {
    const metadata = {};
    const url = p.link;
    delete p.link;

    const liked = (await getIfPostLikedByUser(p.id, user.id)).length > 0;
    const peoples = await selectUsersLikedPost(p.id, user.id);

    try {
      const res = await urlMetadata(url);

      metadata.title = res.title;
      metadata.description = res.description;
      metadata.image = res.image;

      postsWithLinkMetaDatas.push({
        ...p,
        liked,
        peoples,
        link: {
          url,
          ...metadata,
          success: true,
        },
      });
    } catch (error) {
      postsWithLinkMetaDatas.push({
        ...p,
        liked,
        peoples,
        link: { url, success: false },
      });
    }
  }

  return postsWithLinkMetaDatas;
}