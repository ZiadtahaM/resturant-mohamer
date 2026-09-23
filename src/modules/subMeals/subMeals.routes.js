import express from "express";
import { createSubMeal, deleteSubMeal, getSubMeals, updateSubMeal } from "./subMeals.controller.js";
import validate from "../middlewares/validate.js";
import { createSubMealSchema, updateSubMealSchema } from "./subMeals.validateSchema.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import {uploadSingleImage} from "../../utils/multer.js";

let router = express.Router();

router.post('/create',uploadSingleImage('image'),validate(createSubMealSchema),asynchandler(createSubMeal));
router.get('/get',asynchandler(getSubMeals));
router.delete('/delete/:id',asynchandler(deleteSubMeal));
router.patch('/update/:id',validate(updateSubMealSchema),asynchandler(updateSubMeal));

export default router;





