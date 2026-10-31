import multer from "multer";
import path from "path";
import fs from "fs";

// ফোল্ডার না থাকলে অটোমেটিক তৈরি করার লজিক
const uploadDir = "uploads/documents";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // ফাইলগুলো এই ফোল্ডারে সেভ হবে
  },
  filename: function (req, file, cb) {
    // ফাইলের নাম যেন ডুপ্লিকেট না হয়, তাই Date.now() ব্যবহার করা হলো
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// ফাইল ফিল্টার (শুধু ইমেজ এবং পিডিএফ অ্যালাও করা)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg and .pdf formats are allowed!"), false);
  }
};

// Multer এক্সপোর্ট করা (ম্যাক্সিমাম 2MB সাইজ লিমিট)
export const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: fileFilter,
});