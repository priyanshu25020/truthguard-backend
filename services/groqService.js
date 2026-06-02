require('dotenv').config(); // <--- YEH LINE SABSE UPAR ADD KARO
const OpenAI = require("openai");

// 1. Groq Client ko configure karna
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const analyzeWithGroq = async (content) => {
  try {
    console.log("Calling Groq AI for analysis...");

    // 2. Groq AI ko call karna
    const completion = await groq.chat.completions.create({
      messages: [
       {
          role: "system",
          content: `Analyze this news claim. You must strictly output JSON matching exactly this schema:
          {
            "headline": "Short claim headline",
            "verdict": "MOSTLY FALSE" or "VERIFIED TRUE",
            "credibilityScore": (number 0-100),
            "confidence": (number 0-100),
            "summary": "Short 2 sentence summary of analysis",
            "keyInsight": "One striking fact or myth debunked",
            "sources": [
              { "name": "GlobalFact DB", "status": "verified" or "mismatch" },
              { "name": "Snopes", "status": "verified" or "mismatch" }
            ],
            "breakdown": {
              "sourceReliability": (number),
              "evidenceStrength": (number),
              "expertConsensus": (number),
              "contextAccuracy": (number),
              "otherFactors": (number)
            },
            "recommendation": "Safe to share" or "Do not share"
          }`,
        
        },
        {
          role: "user",
          content: content,
        },
      ],
    model: "llama-3.3-70b-versatile", // <--- YAHAN MAINE NAYA ACTIVE MODEL DAAL DIYA HAI
      temperature: 0.1, 
      response_format: { type: "json_object" }, 
    });

    // 3. Groq ke response ko parse karna
    const rawResponse = completion.choices[0].message.content;
    console.log("Groq Raw Response:", rawResponse);

    try {
      const parsedData = JSON.parse(rawResponse);
      return { success: true, ...parsedData };
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      return { success: false, message: "AI response format was invalid." };
    }

  } catch (error) {
    console.error("Error in Groq Service:", error);
    return { success: false, message: "Server error during AI analysis." };
  }
};

module.exports = { analyzeWithGroq };