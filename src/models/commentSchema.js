import Joi from "joi";

export const commentModel = Joi.object({
    comment: Joi.string().required().min(1)
});