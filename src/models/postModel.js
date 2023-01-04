import Joi from "joi";

const postModel = Joi.object({
  link: Joi.string().uri().required(),
  content: Joi.string().allow(""),
});

export default postModel;
