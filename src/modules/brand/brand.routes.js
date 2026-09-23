import { Router } from "express";
import * as brandController from "./brand.controller.js";
import role from '../middlewares/role.js';


const router = Router();
router.get("/", asyncHandler(brandController.getBrands));

router.post(
  "/create",
  isAuthenticated,
  role("ADMIN"),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.createBrandSchema),
  asyncHandler(brandController.createBrand),
);

router.put(
  "/:id",
  isAuthenticated,
  role("ADMIN"),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateBrandSchema),
  asyncHandler(brandController.updateBrand),
);

router.delete(
  "/:id",
  isAuthenticated,
  role("ADMIN"),
  validation(validators.deleteBrandSchema),
  asyncHandler(brandController.deleteBrand),
);

export default router;
