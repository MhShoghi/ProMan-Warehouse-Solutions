const multer = require("multer");
const { Response } = require("../utils");
const Uploader = require("../utils/Uploader");

module.exports = (app) => {
  // Instantiate new uploader object
  const uploader = new Uploader();

  // upload photo
  app.post(
    "/upload",
    uploader.middleware({ type: "single", name: "photo" }),
    (req, res, next) => {
      try {
        Response(res, "Upload successful", req.files, null, 200);

        // Make directory if directory is not exist
      } catch (err) {
        console.log(err);
        next(err);
      }
    }
  );
};
