
const { analyzeWithGroq } = require("../services/groqService");

const analyzeNews = async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Please provide news text or URL to analyze." });
    }

    console.log(`Starting real AI analysis for ${type}: ${content.substring(0, 50)}...`);

    // ASALI AI DIMAG (Groq AI Service ko call) 🧠⚡
    const result = await analyzeWithGroq(content);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message });
    }

    // Frontend ko ASALI result bhej diya
    console.log("Real AI analysis complete!", result);
    res.status(200).json(result);

  } catch (error) {
    console.error("Error in analyzeNews controller:", error);
    res.status(500).json({ success: false, message: "Server Error during analysis." });
  }
};

module.exports = { analyzeNews };