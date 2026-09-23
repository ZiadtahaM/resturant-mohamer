import mongoose from "mongoose";
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    name:{
        type:String,
        required:[true,"Category name is required"],
        unique:true,
    },
    image:{
        type:String, // cloudinary url
        
    },
    Meals:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Meal",
    }],
    Brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Brand",
        
    }
    
},
{timestamps:true}
)
const Category= mongoose.model("Category",categorySchema);
export default Category;