// backend/routes/adminRoutes.js
const router = require("express").Router();

const requireAuth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const adminController = require("../controllers/adminController");

// ✅ All admin routes require both authentication AND admin role
const adminMiddleware = [requireAuth, adminAuth];

// ================= DASHBOARD ANALYTICS =================
router.get("/dashboard/stats", ...adminMiddleware, adminController.getDashboardStats);

// ================= MANAGE CREATIONS =================
router.get("/creations", ...adminMiddleware, adminController.getAllCreations);
router.delete("/creations/:id", ...adminMiddleware, adminController.deleteCreation);
router.patch(
  "/creations/:id/publish",
  ...adminMiddleware,
  adminController.updateCreationPublishStatus
);

// ================= MANAGE PROMPTS =================
router.get("/prompts", ...adminMiddleware, adminController.getAllPrompts);
router.post("/prompts", ...adminMiddleware, adminController.createPrompt);
router.patch("/prompts/:id", ...adminMiddleware, adminController.updatePrompt);
router.delete("/prompts/:id", ...adminMiddleware, adminController.deletePrompt);

// ================= USER ANALYTICS =================
router.get("/users/:userId/stats", ...adminMiddleware, adminController.getUserStats);

module.exports = router;
