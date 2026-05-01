import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Cars storage ─────────────────────────────────────────────────
const carStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "carrent/cars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 800, height: 600, crop: "limit" }],
  },
});

// ── Profile image storage ────────────────────────────────────────
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "carrent/profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
  },
});

// ── Exports ──────────────────────────────────────────────────────
export const upload        = multer({ storage: carStorage });
export const uploadProfile = multer({ storage: profileStorage });
export { cloudinary };