import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Use import.meta.url to get __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define allowed MIME types for docx, pdf, etc.
const allowedMimeTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in the "uploads" directory
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname); // Use a unique filename
  },
});


// File filter to accept only specified MIME types
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type"), false); // Reject the file
  }
};

// Create the multer instance with storage and fileFilter
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // Limit the file size to 30MB
  },
  fileFilter: fileFilter,
});
