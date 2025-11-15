import { protect } from "../middleware/middleware.js";
import express from "express";
import multer from "multer";
import { createProject, getAllProjects, getSingleProject, joinProject , deleteProject, getCurrentUserProjects } from "../controllers/projectController.js";

// Multer storage for project uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/projects");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.post("/", protect, upload.single("image"), createProject);
router.get("/", getAllProjects);
router.get("/:id", getSingleProject);
router.post("/join/:id", protect, joinProject);
router.delete("/:id", protect, deleteProject);
router.get("/user/me", protect, getCurrentUserProjects);

export default router;