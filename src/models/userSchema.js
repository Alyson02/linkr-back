import Joi from "joi";

const userSchema = Joi.object({
  username: Joi.string().required(),
  pictureUrl: Joi.string().uri(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

export default userSchema;
