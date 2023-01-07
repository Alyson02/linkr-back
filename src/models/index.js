import postModel from "./postModel.js";
import userSchema from "./userSchema.js";

const models = {
  signupPOST: userSchema,
  postPOST: postModel,
};

export default models;
