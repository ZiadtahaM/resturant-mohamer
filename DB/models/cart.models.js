
import mongoose from "mongoose";
const cartscheema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true ,
    index: true 
},
meal_id:{
type:mongoose.Schema.Types.ObjectId,
ref:'meals',
required:true
},
  name: {
    type: String,
    required: [true, "Please Include the product name"],
  },
  price: {
    type: String,
    required: [true, "Please Include the product price"],
  },
 image: {
    type: String,
    required: true,
  },
  quantity:{type:Number ,required:true,min:[1,'minimum 1 meal']},
  notes: String,
  price_snapshot: {  // Save price at add time
    type: Number, 
    required: true 
}, size: { 
  type: String, 
  enum: ['small', 'medium', 'large'], 
  default: 'medium' 
}},{ timestamps: true })
cartscheema.index({ user_id: 1, meal_id: 1 });
export default mongoose.model('Cart', cartscheema);