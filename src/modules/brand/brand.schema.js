import joi from "joi";
import { Types } from "mongoose";

const isValidObjectId = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.message(`"${value}" is not a valid ObjectId`);
  }
  return value;
};

export const createBrand = joi
  .object({
    name: joi.string().min(2).max(50).required(),
  })
  .required();

export const updateBrand = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
    name: joi.string().min(2).max(50),
  })
  .required();

export const deleteBrand = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();
