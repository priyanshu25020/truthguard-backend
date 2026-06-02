require('dotenv').config(); 
const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// 🔴 UPDATE STEP 1: Function ab do arguments lega (content aur searchContext)
const analyzeWithGroq = async (content, searchContext) => { 
  try {
    console.log("Calling Groq AI for analysis with live web context...");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          // 🔴 UPDATE STEP 2: System prompt mein AI ko bataya ki search data par focus kare
          content: `You are an elite, highly skeptical fact-checking AI. Current Year: 2026.
          
          CRITICAL RULES:
          1. You will be provided with a user's claim and LIVE web search context retrieved just now.
          2. Base your fact-checking PRIMARILY on the provided live web context. 
          3. DO NOT predict the future, guess, or hallucinate. If a claim is about a future event (e.g., upcoming sports matches, elections) or lacks concrete real-world evidence in the search context, strictly output "UNVERIFIED" or "MOSTLY FALSE".
          4. Do not assume something is true just because it sounds plausible. Be ruthless in your fact-checking.
          5. Ignore minor spelling mistakes or typos (like 'tropies' instead of 'trophies'). If the core historical/present fact is definitively true according to the context, output "VERIFIED TRUE".

          Analyze this news claim. You must strictly output JSON matching exactly this schema. Provide exactly 3 bullet points in the "reasons" array and ensure the "sentiment" percentages add up to 100:
          {
            "headline": "Short claim headline",
            "verdict": "MOSTLY FALSE", "VERIFIED TRUE", or "UNVERIFIED",
            "credibilityScore": (number 0-100, give low scores to future predictions),
            "confidence": (number 0-100),
            "summary": "Short 2 sentence summary of analysis based on the live search data",
            "keyInsight": "One striking fact or myth debunked",
            "reasons": [
              "First explicit reason why AI flagged this, referencing live data if possible.",
              "Second logical reason or evidence found.",
              "Third analytical point regarding the source or claim."
            ],
            "sentiment": {
              "negative": 10,
              "neutral": 30,
              "positive": 60
            },
            "sources": [
              { "name": "Live Web Search", "status": "verified" or "mismatch" },
              { "name": "GlobalFact DB", "status": "verified" or "mismatch" }
            ],
            "breakdown": {
              "sourceReliability": (number),
              "evidenceStrength": (number),
              "expertConsensus": (number),
              "contextAccuracy": (number),
              "otherFactors": (number)
            },
            "recommendation": "Safe to share" or "Do not share"
          }`
        },
        {
          role: "user",
          // 🔴 UPDATE STEP 3: User aur Search Context dono LLM ko bhej diye
          content: `USER CLAIM TO FACT-CHECK:\n"${content}"\n\nLIVE WEB SEARCH CONTEXT (Use this to verify the claim):\n${searchContext ? searchContext : "No live data available."}`,
        },
      ],
      model: "llama-3.3-70b-versatile", 
      temperature: 0.1, 
      response_format: { type: "json_object" }, 
    });

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