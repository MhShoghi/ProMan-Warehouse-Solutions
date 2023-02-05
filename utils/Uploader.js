const multer = require("multer");
const path = require("path");

class Uploader {
  constructor(storeagePath = "uploads") {
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        // cb(null, "/uploads/");
        cb(null, path.join(__dirname, "..", storeagePath));
      },
      filename: function (req, file, cb) {
        let ext = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );

        cb(null, file.fieldname + "-" + Date.now() + ext);
      },
    });

    this.upload = multer({ storage: this.storage });
  }

  middleware(input) {
    const type = input.type || "single";

    if (type === "single") return this.upload[type](input.name);

    if (type === "array") return this.upload[type](input.name, input.maxCount);
    return;
  }
}

module.exports = Uploader;
