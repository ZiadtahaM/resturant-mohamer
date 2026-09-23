import Brand from "../../DB/models/brand.model.js";
import cloudinary from "../../utils/cloudinary.js";

// createBrand
export const createBrand = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("Brand image is required", { cause: 400 }));
  }

  const isNameExist = await Brand.findOne({ name: req.body.name });
  if (isNameExist) {
    return next(new Error("Brand name already exists", { cause: 409 }));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "restaurant-app/brands" },
  );

  const brand = await Brand.create({
    name: req.body.name,
    image: secure_url,
    cloudinary_id: public_id,
  });

  return res.status(201).json({
    success: true,
    message: "Brand created successfully",
    results: { brand },
  });
};

// getAllBrands
export const getBrands = async (req, res, next) => {
  const brands = await Brand.find();

  return res.status(200).json({
    success: true,
    results: { brands },
  });
};

// deleteBrand
export const deleteBrand = async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new Error("Brand not found", { cause: 404 }));
  }
  await cloudinary.uploader.destroy(brand.cloudinary_id);

  await Brand.deleteOne({ _id: id });

  return res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
};

// updateBrand
export const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new Error("Brand not found", { cause: 404 }));
  }
  // Image Update
  if (req.file) {
    await cloudinary.uploader.destroy(brand.cloudinary_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "restaurant-app/brands" },
    );

    brand.image = secure_url;
    brand.cloudinary_id = public_id;
  }

  // Name Update
  if (req.body.name) {
    const isNameExist = await Brand.findOne({ name: req.body.name });
    if (isNameExist) {
      return next(new Error("Brand name already exists", { cause: 409 }));
    }
  }
  brand.name = req.body.name;

  await brand.save();
  return res.status(200).json({
    success: true,
    message: "Brand updated successfully",
    results: { brand },
  });
};
