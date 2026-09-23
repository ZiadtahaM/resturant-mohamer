import express from 'express';
import { getCart, addToCart, updateCart, deleteCartItem, clearCart } from './cart.controller.js'
import auth from '../middlewares/auth.js';
const cartroutes = express.Router();
cartroutes.get('/test', (req, res) => {
    res.json({ message: 'Routes loaded successfully!' });
});
cartroutes.use(auth);
cartroutes.get('/cart', getCart);
cartroutes.post('/cart', addToCart);
cartroutes.put('/cart/:id', updateCart);
cartroutes.delete('/cart/:id', deleteCartItem);
cartroutes.delete('/cart', clearCart);

export default cartroutes ;