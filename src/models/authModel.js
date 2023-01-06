import Joi from "joi";

export const signInModel = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});