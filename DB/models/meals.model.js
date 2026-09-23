    import mongoose from 'mongoose';

    const mealsscheema = new mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },
        image: { type: String },
        isAvailable: { type: Boolean, default: true }
    }, { timestamps: true });

    export default mongoose.model('meals', mealsscheema);
