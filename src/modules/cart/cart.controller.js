import Cart from '../../../DB/models/cart.models.js';
import Meal from '../../../DB/models/meals.model.js';

export const getCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const cartItems = await Cart.find({ user_id })
            .populate('meal_id', 'name price category image isAvailable')
            .sort({ createdAt: -1 });

        if (!cartItems || cartItems.length === 0) {
            return res.status(200).json({ 
                message: 'Cart is empty', 
                cart: [],
                total: 0 
            });
        }

        const cartWithTotals = cartItems.map(item => ({
            _id: item._id,
            meal: {
                id: item.meal_id._id,
                name: item.meal_id.name,
                price: item.meal_id.price,
                category: item.meal_id.category,
                image: item.meal_id.image,
                isAvailable: item.meal_id.isAvailable
            },
            quantity: item.quantity,
            size: item.size,
            notes: item.notes,
            price_per_unit: item.price_snapshot,
            subtotal: item.price_snapshot * item.quantity
        }));

        const total = cartWithTotals.reduce((sum, item) => sum + item.subtotal, 0);

        res.status(200).json({
            success: true,
            cart: cartWithTotals,
            itemCount: cartItems.length,
            total: parseFloat(total.toFixed(2))
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch cart' 
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { meal_id, quantity = 1, size = 'medium', notes } = req.body;

        // Validate meal exists and is available
        const meal = await Meal.findById(meal_id);
        if (!meal || !meal.isAvailable) {
            return res.status(404).json({ error: 'Meal not available' });
        }

        // Check if item already exists in cart
        let cartItem = await Cart.findOne({ user_id, meal_id });
        
        if (cartItem) {
            // Update existing item
            cartItem.quantity += quantity;
            cartItem.notes = notes || cartItem.notes;
            cartItem.size = size || cartItem.size;
        } else {
            // Create new cart item
            cartItem = new Cart({ 
                user_id, 
                meal_id, 
           
        name: meal.name,
        image: meal.image,
        price: meal.price, 

        quantity, 
        size, 
        notes, 
        price_snapshot: meal.price
            });
        }
        
        await cartItem.save();
        res.status(201).json({ 
            success: true, 
            message: 'Added to cart',
            cartItem 
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

export const updateCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id: cartItemId } = req.params;
        const { quantity, size, notes } = req.body;

        const cartItem = await Cart.findOne({ 
            _id: cartItemId, 
            user_id 
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        if (quantity !== undefined) cartItem.quantity = quantity;
        if (size !== undefined) cartItem.size = size;
        if (notes !== undefined) cartItem.notes = notes;

        await cartItem.save();
        res.json({ success: true, cartItem });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id: cartItemId } = req.params;

        const deleted = await Cart.findOneAndDelete({ 
            _id: cartItemId, 
            user_id 
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Delete cart item error:', error);
        res.status(500).json({ error: 'Failed to delete cart item' });
    }
};

export const clearCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const result = await Cart.deleteMany({ user_id });
        
        res.json({ 
            success: true, 
            message: `Cleared ${result.deletedCount} items from cart` 
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};
