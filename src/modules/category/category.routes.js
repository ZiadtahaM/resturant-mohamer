import express from 'express';
import { uploadSingleImage } from '../../utils/multer.js';
import validate from '../middlewares/validate.js';
import {asynchandler} from '../../utils/asyncHandler.js'
import { createCategory,
        deleteCategory,
        getCategories,
        getSpecificCategory,
        updateCategory } from './category.controller.js';
import { createCategorySchema, updateCategorySchema } from './category.validateSchema.js'
 import role from '../middlewares/role.js';

const categoryRoutes=express.Router();

categoryRoutes.post('/create',
    role("ADMIN"),
    uploadSingleImage('image'),
    validate(createCategorySchema),
    asynchandler(createCategory)
    );
    categoryRoutes.get('/',asynchandler(getCategories));
    categoryRoutes.get('/:id',asynchandler(getSpecificCategory))
categoryRoutes.delete('/delete/:id',role("ADMIN"),asynchandler(deleteCategory));
categoryRoutes.patch('/update/:id',
    uploadSingleImage('image'),
    role("ADMIN"),
    validate(updateCategorySchema),
    asynchandler(updateCategory));
export default categoryRoutes;