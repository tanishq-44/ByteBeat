import path from 'path';
import multer from 'multer';
import { Request } from 'express';
import cloudinary from '../config/cloudinary';

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Check file type
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Images Only!'));
};

// Initialize upload
export const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter,
});

// Upload file to Cloudinary
export const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'bytebeat',
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}; 