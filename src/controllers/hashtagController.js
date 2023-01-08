import { listHashtags } from "../repositories/hashtagRepository.js";
import dotenv from "dotenv";
dotenv.config();

export async function getHashtag(req, res) {
  try {
    const hashtagList = await listHashtags();
    res.status(200).send(hashtagList.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}