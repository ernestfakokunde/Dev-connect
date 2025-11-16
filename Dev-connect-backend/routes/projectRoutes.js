import { protect } from "../middleware/middleware.js";
import express from "express";
import multer from "multer";
import { createProject, getAllProjects, getSingleProject, joinProject , deleteProject, getCurrentUserProjects } from "../controllers/projectController.js";

// Use memoryStorage to upload files to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/", protect, upload.single("image"), createProject);
router.get("/", getAllProjects);
router.get("/:id", getSingleProject);
router.post("/join/:id", protect, joinProject);
router.delete("/:id", protect, deleteProject);
router.get("/user/me", protect, getCurrentUserProjects);

export default router;