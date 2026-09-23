import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const multerOptions = () => {
  //Diskstorage
  // const multerStorge = multer.diskStorge({
  //   destination:  (req, file, cb)=> {
  //     cb(null, "uploads/");
  //   },
  //   filename: (req, file, cb)=> {
  //     //folder-${id}-Date.now().jpeg
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `folder-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });

  //2-memeory storge
  const multerStorge = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    //image/jpeg
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error(`Only Image is allowed`), false);
    }
  };

  const upload = multer({ storage: multerStorge, fileFilter: multerFilter });
  return upload;
};

export const uploadSingleImage = (fieldName) =>
  multerOptions().single(fieldName);
export const uploadMixedImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
