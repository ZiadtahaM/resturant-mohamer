import { Schema, model } from 'mongoose';

const subMealSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    image: {
        type: String
    }
}, { timestamps: true });

subMealSchema.statics.searchByName = function (name) {
  return this.find({
    name: { $regex: name, $options: 'i' },
  });
};

export default model('SubMeal', subMealSchema);