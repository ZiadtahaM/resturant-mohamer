import subMealsModel from "../../../DB/models/subMeals.model.js";
import cloudinary from "../../utils/cloudnairy.js";

export const createSubMeal = async (req, res) => {
  let { name, price } = req.body;
  if (!name || !price)
    return res.status(400).json({ message: "Name and Price are required" });
  if (!req.file) return res.status(400).json({ message: "Image is required" });

  // Upload image to Cloudinary
const result = await new Promise((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    { folder: "subMeals" },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  ).end(req.file.buffer);
});
req.body.image = result.secure_url;

  const existingSubMeal = await subMealsModel.findOne({ name });
  if (existingSubMeal)
    return res.status(400).json({ message: "SubMeal already exists" });
  const subMeal = await subMealsModel.create(req.body);
  res.status(201).json({ message: "SubMeal created successfully", subMeal });
};

export const getSubMeals = async (req, res) => {
  const { search } = req.query;
  let subMeals;
  if (search) {
    subMeals = await subMealsModel.searchByName(search);
  } else {
    subMeals = await subMealsModel.find();
  }
  res.status(200).json({ subMeals });
};

export const deleteSubMeal = async (req, res) => {
  const { id } = req.params;
  const existingSubMeal = await subMealsModel.findById(id);
  if (!existingSubMeal)
    return res.status(404).json({ message: "SubMeal not found" });
  const subMeal = await subMealsModel.findByIdAndDelete(id);
  if (!subMeal) return res.status(404).json({ message: "SubMeal not found" });
  res.status(200).json({ message: "SubMeal deleted successfully" });
};

export const updateSubMeal = async (req, res) => {
  const existingSubMeal = await subMealsModel.findById(req.params.id);
  if (!existingSubMeal)
    return res.status(404).json({ message: "SubMeal not found" });
  if (req.file) {
    //destroy old image from cloudinary
    const oldPublicId = existingSubMeal.image
      ?.split("/")
      .slice(-2)
      .join("/");
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }
    // Upload new image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "subMeals" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });
    existingSubMeal.image = result.secure_url;
  }
  const updatedSubMeals = await subMealsModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res
    .status(200)
    .json({ message: "SubMeal updated successfully", updatedSubMeals });
};
