import multer from "multer";
import { FILES_EXTENSIONS } from "../utils/constants.utils.js";
import fs from "node:fs";

const multerLocal = (subFolder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destination = `uploads/${subFolder}`;
      fs.mkdirSync(destination, { recursive: true });
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const finalFileName = uniquePrefix + "-" + file.originalname;
      cb(null, finalFileName);
    },
  });
  const limits = {
    filesSize: 10 * 1024 * 1024,
    files: 1,
  };
  return multer({ limits, fileFilter, storage });
};

const fileFilter = function () {
  const [fileType, fileExtention] = file.mimetype.split("/");
  if (FILES_EXTENSIONS[fileType].includes(fileExtention)) {
    return cb(null, true);
  }
  return cb(null, false);
};
export default multerLocal;
