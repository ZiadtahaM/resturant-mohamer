import meals from '../../../DB/models/meals.model.js';
import mongoose from 'mongoose';
// GET /meals/:id
export const getmealbyid = async (req, res, next) => {
    try {
        const Meal = await meals.findById(req.params.id);
        if (!Meal) return res.status(404).json({ success: false, message: 'meal not found' });
        res.status(200).json({ success: true, data: Meal });
    } catch (error) {
        next(error);
    }
};

// GET /meals
export const getallmeals = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice, page = 1, limit = 10, sort = '-createdAt' } = req.query;
        const filter = {};
        
        if (category) filter.category = category;
        if (minPrice || maxPrice) filter.price = {};
        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;

        const MEALS = await meals.find(filter)
            .select('-__v')
            .limit(limit)
            .sort(sort)
            .skip((page - 1) * limit);
            
        const count = await meals.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            data: MEALS,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalItems: count
            }
        });
    } catch (error) {
        next(error);
    }
};

// POST /meals
export const creatmeal = async (req, res, next) => {
    try {
        const meal = await meals.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Meal created successfully',
            data: meal
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        next(error);
    }
};

// PUT /meals/:id
export const updateMeal = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid meal ID format' 
            });
        }
        
        const meal = await meals.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!meal) {
            return res.status(404).json({ 
                success: false,
                error: 'Meal not found' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Meal updated successfully',
            data: meal 
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /meals/:id
export const deleteMeal = async (req, res, next) => {
    try {
        let { id } = req.params;
        id=id.trim()
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid meal ID format' 
            });
        }
        
        const meal = await meals.findByIdAndUpdate(
            id,
            { isAvailable: false },
            { new: true }
        );
        
        if (!meal) {
            return res.status(404).json({ 
                success: false,
                error: 'Meal not found' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Meal deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
