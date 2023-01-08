import { listHashtagPosts } from "../repositories/hashtagRepository.js";
import dotenv from "dotenv";
dotenv.config();

export async function getHashtags(req, res) {
  try {
    const hashtagList = await listHashtags();
    res.status(200).send(hashtagList.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getHashtagPosts(req, res) {

  const { id } = req.params;

  try {
    const hashtagList = await listHashtagPosts(id);
    res.status(200).send(hashtagList.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}