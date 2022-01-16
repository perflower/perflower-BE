const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(
      new Error(" .png, .jpg ,.jpeg and .gif 파일만 업로드 가능합니다.")
    );
  }
};
module.exports = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "perflowerbucket1",
    key(req, file, cb) {
      cb(null, `profiles/${Date.now()}${path.basename(file.originalname)}`);
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
