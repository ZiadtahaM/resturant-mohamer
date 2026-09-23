import { Schema, model } from "mongoose";
const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      minlength: [2, "Name is too short"],
    },
    image: {
      type: String,
      required: [true, "Image Required!!"],
    },
    cloudinary_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
brandSchema.virtual("meals", {
  ref: "Meal",
  localField: "_id",
  foreignField: "brand",
});

const Brand = model("Brand", brandSchema);
export default Brand;
