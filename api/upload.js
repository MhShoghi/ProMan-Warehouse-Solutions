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

  // app.post(
  //   "/upload/products",
  //   upload.single("file"),
  //   async (req, res, next) => {
  //     const file = req.file;
  //     const workbook = XLSX.read(file.buffer, { type: "buffer" });
  //     const productsSheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const products = XLSX.utils.sheet_to_json(productsSheet);

  //     const errors = [];
  //     for (const product of products) {
  //       const { name, unit, quantity } = product;
  //       if (!name || !unit || !quantity) {
  //         errors.push(
  //           `Name, unit, and quantity are required for product: ${JSON.stringify(
  //             product
  //           )}`
  //         );
  //         continue;
  //       }
  //       try {
  //         const newProduct = new Product({ name, unit, quantity });
  //         await newProduct.save();
  //       } catch (err) {
  //         errors.push(
  //           `Error saving product: ${JSON.stringify(product)}: ${err}`
  //         );
  //       }
  //     }

  //     if (errors.length) {
  //       return res.status(400).json({ errors });
  //     }
  //     res.json({ message: "Import successful" });
  //   }
  // );
};
