// // backend/routes/aiRoutes.js
// const router = require("express").Router();

// const requireAuth = require("../middlewares/auth");
// const { aiLimiter } = require("../middlewares/rateLimit");
// const { uploadImage, uploadPDF } = require("../configs/multer");

// // ❌ DO NOT destructure incorrectly
// const aiController = require("../controllers/aiController");

// // ✅ SAFETY CHECK (optional but helpful)
// if (!aiController.generateArticle) {
//   throw new Error("aiController.generateArticle is undefined");
// }
// console.log("AI CONTROLLER KEYS:", Object.keys(aiController));

// router.post("/generate-article", requireAuth, aiLimiter, aiController.generateArticle);
// router.post("/generate-image", requireAuth, aiLimiter, aiController.generateImage);
// router.post("/resume-review", requireAuth, aiLimiter, uploadPDF.single("file"), aiController.resumeReview);
// router.post("/remove-bg", requireAuth, aiLimiter, uploadImage.single("image"), aiController.removeBackground);
// router.post("/remove-object", requireAuth, aiLimiter, uploadImage.single("image"), aiController.removeObject);

// module.exports = router;
// backend/routes/aiRoutes.js
const router = require("express").Router();

const requireAuth = require("../middlewares/auth");
const { aiLimiter } = require("../middlewares/rateLimit");
const { uploadImage, uploadPDF } = require("../configs/multer");

const aiController = require("../controllers/aiController");

// ✅ NEW BACKEND (your current endpoints)
router.post("/generate-article", requireAuth, aiLimiter, aiController.generateArticle);
router.post("/generate-image", requireAuth, aiLimiter, aiController.generateImage);
router.post("/resume-review", requireAuth, aiLimiter, uploadPDF.single("file"), aiController.resumeReview);
router.post("/remove-bg", requireAuth, aiLimiter, uploadImage.single("image"), aiController.removeBackground);
router.post("/remove-object", requireAuth, aiLimiter, uploadImage.single("image"), aiController.removeObject);

// ✅ COMPATIBILITY ALIASES (match old frontend calls)
router.post("/write-article", requireAuth, aiLimiter, aiController.generateArticle);

router.post("/generate-blog-title", requireAuth, aiLimiter, aiController.generateBlogTitle);
router.post("/blog-titles", requireAuth, aiLimiter, aiController.generateBlogTitle);

router.post("/generate-images", requireAuth, aiLimiter, aiController.generateImage);

router.post("/remove-background", requireAuth, aiLimiter, uploadImage.single("image"), aiController.removeBackground);

router.post("/review-resume", requireAuth, aiLimiter, uploadPDF.single("file"), aiController.resumeReview);

// ✅ TEXT-BASED RESUME REVIEW (no file upload needed)
router.post("/review-resume-text", requireAuth, aiLimiter, aiController.resumeReview);

module.exports = router;
