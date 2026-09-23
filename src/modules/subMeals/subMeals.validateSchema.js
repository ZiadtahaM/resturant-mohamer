import joi from "joi";


export const createSubMealSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  price: joi.number().min(1).required(),
  quantity: joi.number().min(1),
  image: joi.string().uri()
});
export const updateSubMealSchema = joi.object({
  name: joi.string().min(3).max(30),
  price: joi.number().min(1),
  quantity: joi.number().min(1),
  image: joi.string().uri(),
}); 