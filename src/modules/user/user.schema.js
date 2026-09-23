import Joi from 'joi';

// register validation
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .max(30)
    .required(),
});

// login validation
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});
