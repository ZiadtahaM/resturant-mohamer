import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

/**
  value is the acutal value sended in request body or sent by user 
  helpers is an object that contains serveral methods (provided by Joi)
  mongoose.Types.ObjectId.isValid(value) checks if the value is a valid MongoDB ObjectId
 * */

export const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name should be a type of 'text'",
    "string.empty": "Name cannot be an empty field",
    "string.min": "Name should have a minimum length of {3}",
    "string.max": "Name should have a maximum length of {30}",
  }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL",
  }),
  Meals: Joi.array()
    .items(Joi.string().custom(objectIdValidator, "ObjectId validation"))
    .optional(),
  Brand: Joi.string().custom(objectIdValidator, "ObjectId validation").optional(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(30).optional().messages({
    "string.base": "Name should be a type of 'text'",
    "string.empty": "Name cannot be an empty field",
    "string.min": "Name should have a minimum length of {3}",
    "string.max": "Name should have a maximum length of {30}",
  }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL",
  }),
  Meals: Joi.array()
    .items(Joi.string().custom(objectIdValidator, "ObjectId validation"))
    .optional(),
  Brand: Joi.string().custom(objectIdValidator, "ObjectId validation").optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
