import express from "express";
import { uploadMultiple } from "multermate-es";

import controller from "../controllers/userProducts.js";
import { verifyAccessToken } from "../middlewares/auth.js";

const router = express.Router();

const productUpload = uploadMultiple({
  destination: "uploads/images",
  fields: [{ name: "images", maxCount: 5, fileTypes: ["images"] }],
  fileSizeLimit: 5 * 1024 * 1024,
});

router.get("/search", controller.searchProducts);

router.use(verifyAccessToken);

router.get("/export-excel", controller.exportExcelProducts);
router.get("/export-pdf", controller.exportPdfProducts);
router.post("/", productUpload, controller.createProduct);
router.get("/", controller.listProducts);
router.get("/:id", controller.getProduct);
router.put("/:id", productUpload, controller.updateProduct);
router.delete("/:id", controller.deleteProduct);
router.delete(
  "/products/:productId/images/:imageId",
  controller.deleteProductImage
);

export default router;
