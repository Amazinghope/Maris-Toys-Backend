import Joi from 'joi';

const registerValidationSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().min(2).required(),
    email: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    role: Joi.string().valid("regular", "admin").required(),
});

const loginvalidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export { registerValidationSchema, loginvalidationSchema}