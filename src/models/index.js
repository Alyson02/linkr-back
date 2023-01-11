import { commentModel } from "./commentSchema.js";
import postModel from "./postModel.js";
import userSchema from "./userSchema.js";

const models = {
  signupPOST: userSchema,
  postPOST: postModel,
  commentPOST: commentModel
};

export default models;
