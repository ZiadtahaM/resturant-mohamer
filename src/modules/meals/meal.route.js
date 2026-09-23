import express from 'express';
import * as mealcontroller from './meals.controller.js';  

import { 
    validatecreatmealscheema,
    validateGetMealsQuery, 
    validatemealidparamsscheema,
    validateupdateMealBodySchema 
} from './meal.validate.js';

const mealrouter=express.Router();

mealrouter.get('/:id', validatemealidparamsscheema, mealcontroller.getmealbyid);
mealrouter.get('/', validateGetMealsQuery, mealcontroller.getallmeals);           
mealrouter.put('/:id', validatemealidparamsscheema, validateupdateMealBodySchema, mealcontroller.updateMeal);
mealrouter.post('/', validatecreatmealscheema, mealcontroller.creatmeal);          
mealrouter.delete('/:id', mealcontroller.deleteMeal);

export default mealrouter;
