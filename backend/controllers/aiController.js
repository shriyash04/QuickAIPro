// backend/controllers/aiController.js
// ✅ FINAL, CLEAN, WORKING VERSION (Gemini FREE – stable)

const fs = require("fs");
const path = require("path");
const Creation = require("../models/Creation");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ================= GEMINI SETUP =================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 const MODEL_NAME = "gemini-2.5-flash"; // ✅ supported & free


// ================= ARTICLE =================
async function generateArticle(req, res) {
  try {
    const userId = req.userId;
    const prompt = String(req.body?.prompt || "").trim();

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt required" });

    // const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(
      `Write a clear, well-structured article with headings and paragraphs:\n\n${prompt}`
    );

    const content = result.response.text();

    await Creation.create({
      userId,
      type: "article",
      prompt,
      content,
      publish: false,
    });

    return res.json({ success: true, data: { content } });
  } catch (err) {
    console.error("generateArticle ERROR:", err.message);
    return res.status(500).json({ success: false, message: "Article generation failed" });
  }
}

// ================= BLOG TITLES =================
async function generateBlogTitle(req, res) {
  try {
    const userId = req.userId;
    const topic = String(req.body?.prompt || req.body?.topic || "").trim();

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!topic) return res.status(400).json({ success: false, message: "Topic required" });

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(
      `Generate 5 catchy, SEO-friendly blog titles about:\n${topic}\nReturn only the titles.`
    );

    const titles = result.response.text();

    await Creation.create({
      userId,
      type: "blog-titles",
      prompt: topic,
      content: titles,
      publish: false,
    });

    return res.json({ success: true, data: { titles } });
  } catch (err) {
    console.error("generateBlogTitle ERROR:", err.message);
    return res.status(500).json({ success: false, message: "Blog title generation failed" });
  }
}

// // ================= IMAGE PROMPT =================
// async function generateImage(req, res) {
//   try {
//     const userId = req.userId;
//     const idea = String(req.body?.prompt || req.body?.description || "").trim();

//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
//     if (!idea) return res.status(400).json({ success: false, message: "Prompt required" });

//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const result = await model.generateContent(
//       `Create a detailed AI image generation prompt including subject, style, lighting, camera angle, and environment:\n${idea}`
//     );

//     const imagePrompt = result.response.text();

//     await Creation.create({
//       userId,
//       type: "image-prompt",
//       prompt: idea,
//       content: imagePrompt,
//       publish: false,
//     });

//     return res.json({ success: true, data: { prompt: imagePrompt } });
//   } catch (err) {
//     console.error("generateImage ERROR:", err.message);
//     return res.status(500).json({ success: false, message: "Image prompt generation failed" });
//   }
// }


// ================= IMAGE GENERATION =================
async function generateImage(req, res) {
  try {
    const userId = req.userId;
    const idea = String(req.body?.prompt || req.body?.description || "").trim();

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!idea) return res.status(400).json({ success: false, message: "Prompt required" });

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // STEP 1: Generate detailed prompt using Gemini
    const result = await model.generateContent(
      `Create a detailed AI image generation prompt including subject, style, lighting, camera angle, and environment:\n${idea}`
    );

    const imagePrompt = result.response.text().trim();

    // STEP 2: Encode prompt for URL
    const encodedPrompt = encodeURIComponent(imagePrompt);

    // STEP 3: Create Pollinations Image URL
    const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=1024&height=1024&key=${process.env.POLLINATIONS_API_KEY}`;

    // STEP 4: Save to DB
    await Creation.create({
      userId,
      type: "image",
      prompt: idea,
      content: imagePrompt,
      imageUrl: imageUrl,
      publish: false,
    });

    // STEP 5: Return response
    return res.json({
      success: true,
      data: {
        prompt: imagePrompt,
        imageUrl: imageUrl,
      },
    });

  } catch (err) {
    console.error("generateImage ERROR:", err.message);
    return res.status(500).json({ success: false, message: "Image generation failed" });
  }
}

// ================= RESUME REVIEW =================
async function resumeReview(req, res) {
  try {
    const userId = req.userId;
    const resumeText = String(req.body?.resume || "").trim();

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!resumeText) return res.status(400).json({ success: false, message: "Resume text required" });

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(`
You are a professional ATS resume reviewer.

STRICT RULES:
- Do NOT ask for more information
- Do NOT mention missing data or placeholders
- Do NOT give warnings
- ALWAYS provide an evaluation

Return EXACTLY in this format:

STRENGTHS:
- (bullet points)

WEAKNESSES:
- (bullet points)

ATS SCORE:
<number>/100

IMPROVEMENT SUGGESTIONS:
- (bullet points)

RESUME TEXT:
${resumeText}
`);

    const review = result.response.text();

    await Creation.create({
      userId,
      type: "resume-review",
      prompt: "resume-review",
      content: review,
      publish: false,
    });

    return res.json({ success: true, data: { review } });
  } catch (err) {
    console.error("resumeReview ERROR:", err.message);
    return res.status(500).json({ success: false, message: "Resume review failed" });
  }
}


// ================= PLACEHOLDER IMAGE OPS =================
async function removeBackground(req, res) {
  const userId = req.userId;
  const filePath = req.file?.path;

  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  if (!filePath) return res.status(400).json({ success: false, message: "Image required" });

  try {
    const url = `https://example.com/bg-removed/${path.basename(filePath)}`;

    await Creation.create({
      userId,
      type: "remove-bg",
      prompt: "remove-bg",
      content: url,
      publish: false,
    });

    return res.json({ success: true, data: { url } });
  } finally {
    try { fs.unlinkSync(filePath); } catch {}
  }
}

async function removeObject(req, res) {
  const userId = req.userId;
  const filePath = req.file?.path;

  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  if (!filePath) return res.status(400).json({ success: false, message: "Image required" });

  try {
    const url = `https://example.com/object-removed/${path.basename(filePath)}`;

    await Creation.create({
      userId,
      type: "remove-object",
      prompt: "remove-object",
      content: url,
      publish: false,
    });

    return res.json({ success: true, data: { url } });
  } finally {
    try { fs.unlinkSync(filePath); } catch {}
  }
}

// ================= EXPORTS =================
module.exports = {
  generateArticle,
  generateBlogTitle,
  generateImage,
  resumeReview,
  removeBackground,
  removeObject,
};
