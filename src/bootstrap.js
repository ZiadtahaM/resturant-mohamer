import dbConnection from "../DB/connection.js";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

import userRoutes from './modules/user/user.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import chatRoutes from './modules/chat/chatbot.router.js';
import subMealsRoutes from './modules/subMeals/subMeals.routes.js';
import mealRoutes from './modules/meals/meal.route.js';
import cartRoutes from './modules/cart/cart.rout.js';

const bootstrap = async (app, express) => {
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(compression());
    app.use(helmet());
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, 
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use(limiter);
    
    // Routes
    app.use('/api/auth', userRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/subMeals', subMealsRoutes);
    app.use('/meals', mealRoutes);
    app.use('/cart', cartRoutes);
    
    // Global Error Handler
    app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    });

    await dbConnection();
};

export default bootstrap;
