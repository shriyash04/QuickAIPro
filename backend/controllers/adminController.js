// backend/controllers/adminController.js
const mongoose = require("mongoose");
const Creation = require("../models/Creation");
const PromptTemplate = require("../models/PromptTemplate");
const CreationLike = require("../models/CreationLike");

// ================= DASHBOARD ANALYTICS =================
exports.getDashboardStats = async (req, res) => {
  try {
    // Total stats
    const totalCreations = await Creation.countDocuments();
    const totalPrompts = await PromptTemplate.countDocuments();
    const totalLikes = await CreationLike.countDocuments();
    const uniqueUsers = await Creation.distinct("userId").then((ids) => ids.length);
    const publicCreations = await Creation.countDocuments({ publish: true });

    // Creations by type
    const creationsByType = await Creation.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    // Recent creations
    const recentCreations = await Creation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Top creators
    const topCreators = await Creation.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        totalCreations,
        totalPrompts,
        totalLikes,
        uniqueUsers,
        publicCreations,
        creationsByType,
        recentCreations,
        topCreators,
      },
    });
  } catch (err) {
    console.error("getDashboardStats ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to load dashboard stats",
      });
  }
};

// ================= MANAGE CREATIONS =================
exports.getAllCreations = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, userId, publish } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (type) filter.type = type;
    if (userId) filter.userId = userId;
    if (publish !== undefined) filter.publish = publish === "true";

    const total = await Creation.countDocuments(filter);
    const creations = await Creation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: creations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getAllCreations ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to load creations",
      });
  }
};

exports.deleteCreation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid creation ID",
      });
    }

    const creation = await Creation.findByIdAndDelete(id);

    if (!creation) {
      return res.status(404).json({
        success: false,
        message: "Creation not found",
      });
    }

    // Also delete associated likes
    await CreationLike.deleteMany({ creationId: id });

    res.json({
      success: true,
      message: "Creation deleted successfully",
    });
  } catch (err) {
    console.error("deleteCreation ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete creation",
      });
  }
};

exports.updateCreationPublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { publish } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid creation ID",
      });
    }

    const creation = await Creation.findByIdAndUpdate(
      id,
      { publish: Boolean(publish) },
      { new: true }
    );

    if (!creation) {
      return res.status(404).json({
        success: false,
        message: "Creation not found",
      });
    }

    res.json({
      success: true,
      message: "Creation updated successfully",
      data: creation,
    });
  } catch (err) {
    console.error("updateCreationPublishStatus ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update creation",
      });
  }
};

// ================= MANAGE PROMPTS =================
exports.getAllPrompts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, isPublic } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (category) filter.category = category;
    if (isPublic !== undefined) filter.isPublic = isPublic === "true";

    const total = await PromptTemplate.countDocuments(filter);
    const prompts = await PromptTemplate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: prompts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getAllPrompts ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to load prompts",
      });
  }
};

exports.createPrompt = async (req, res) => {
  try {
    const { title, content, category, isPublic } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const prompt = await PromptTemplate.create({
      userId: "admin",
      title,
      content,
      category: category || "general",
      isPublic: isPublic || false,
    });

    res.status(201).json({
      success: true,
      message: "Prompt created successfully",
      data: prompt,
    });
  } catch (err) {
    console.error("createPrompt ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create prompt",
      });
  }
};

exports.updatePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, isPublic } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prompt ID",
      });
    }

    const prompt = await PromptTemplate.findByIdAndUpdate(
      id,
      { title, content, category, isPublic },
      { new: true, runValidators: true }
    );

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found",
      });
    }

    res.json({
      success: true,
      message: "Prompt updated successfully",
      data: prompt,
    });
  } catch (err) {
    console.error("updatePrompt ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update prompt",
      });
  }
};

exports.deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prompt ID",
      });
    }

    const prompt = await PromptTemplate.findByIdAndDelete(id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found",
      });
    }

    res.json({
      success: true,
      message: "Prompt deleted successfully",
    });
  } catch (err) {
    console.error("deletePrompt ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete prompt",
      });
  }
};

// ================= USER ANALYTICS =================
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const userCreations = await Creation.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const creationIds = userCreations.map((c) => c._id);
    const userLikes = await CreationLike.countDocuments({
      creationId: { $in: creationIds },
    });

    const creationsByType = {};
    userCreations.forEach((c) => {
      creationsByType[c.type] = (creationsByType[c.type] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        userId,
        totalCreations: userCreations.length,
        totalLikes: userLikes,
        creationsByType,
        creations: userCreations.slice(0, 10),
      },
    });
  } catch (err) {
    console.error("getUserStats ERROR:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to load user stats",
      });
  }
};
