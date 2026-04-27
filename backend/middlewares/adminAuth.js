// backend/middlewares/adminAuth.js
// Get admin IDs from environment variable (comma-separated)
const ADMIN_IDS = (process.env.ADMIN_USER_IDS || "").split(",").map(id => id.trim()).filter(Boolean);

const adminAuth = (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No user ID",
    });
  }

  if (ADMIN_IDS.length === 0) {
    console.warn("⚠️ WARNING: No admin IDs configured in ADMIN_USER_IDS env variable");
    return res.status(403).json({
      success: false,
      message: "Forbidden - Admin access required (not configured)",
    });
  }

  if (!ADMIN_IDS.includes(userId)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden - Admin access required",
    });
  }

  next();
};

module.exports = adminAuth;
