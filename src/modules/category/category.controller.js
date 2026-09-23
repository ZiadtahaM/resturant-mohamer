import Category from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudnairy.js";
/**
 * @desc Get All Categries 
 * @route Get /api/categories/
 * @access Public
 */
export const getCategories = async (req, res) => {
        const page=req.query.page||1;
        const limit=req.query.limit||5;
        const skip=(page-1)*limit;
        const categories = await Category.find().skip(skip).limit(limit)
                if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found " });
        }
    res
        .status(200)
        .json({ message: "Categories retrieved successfully", categories });
    
};
/**
 * @desc Get Specific Category 
 * @route Get /api/categories/:id
 * @access Public
 */
export const getSpecificCategory=async(req,res)=>{
  const {id}=req.params;
  const category=await Category.findById(id)
  if(!category){
    res.status(404).json({
      status:"fail",
      message:`Category with Id :${id } Not found`
    })
  }
  res.status(200).json({
    status:"success",
    data:category
    })
}
/**
 * @desc Create 
 * @route Post /api/categories/
 * @access Private
 */
export const createCategory = async (req, res) => {
    const { name, Brand } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image is required" });
    if (!name ) return res.status(400).json({ message: "Name and Brand are required" });
    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "categories" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    // Create category in DB
    const category = new Category({
      name,
      image: result.secure_url,
    });
    await category.save();
    res.status(201).json(category);
};
/**
 * @desc Delete Specifice Categroy 
 * @route Del /api/categories/
 * @access Private
 */
export const deleteCategory =async (req,res )=>{
  
    const {id}=req.params
    const category= await Category.findByIdAndDelete(id)
    if(!category){
      return res.status(404).json({message:"Category not found"})
    }
    res.status(200).json({message:"Category deleted successfully",category})
  
}
/**
 * @desc Update specifice Category
 * @route Patch /api/categories/
 * @access Private
 */
export const updateCategory =async (req,res)=>{
    const {id}=req.params
    const {name}=req.body
    const  category= await Category.findById(id)
    if(!category){
      return res.status(404).json({message:"Category not Founded"})
    }
    if(req.file){
        const oldPublicId = category.image
          ?.split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId);
      }
      const result= await new Promise ((resolve,reject)=>{
      const stream= cloudinary.uploader.upload_stream(
        {folder:"categories"},
        (error,result)=>{
          if(error) reject (error);
          else resolve (result);
        }
      );
      stream.end(req.file.buffer);
    })
      category.image=result.secure_url;
    }
    if(name){
      category.name=name
    }
    await category.save();
    res.status(200).json({message:"Category updated successfully",category}) 
}