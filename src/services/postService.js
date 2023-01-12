import {
  getIfPostIsRepost,
  getIfPostLikedByUser,
  selectUsersLikedPost,
} from "../repositories/postRespository.js";
import urlMetadata from "url-metadata";
import { validationUserQuery } from "../repositories/userRepository.js";

export async function listPostsWithLinkMetadata(user, posts) {
  const postsWithLinkMetaDatas = [];

  for (let p of posts) {
    const metadata = {};
    const url = p.link;
    delete p.link;

    const liked = (await getIfPostLikedByUser(p.id, user.id)).length > 0;
    const peoples = await selectUsersLikedPost(p.id, user.id);

    let repost = await getIfPostIsRepost(p.id, user.id);
    const reposted = repost.length > 0;
    repost = repost[0];

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
        reposted,
        repost,
      });
    } catch (error) {
      postsWithLinkMetaDatas.push({
        ...p,
        liked,
        peoples,
        reposted,
        repost,
        link: { url, success: false },
      });
    }
  }

  return postsWithLinkMetaDatas;
}
