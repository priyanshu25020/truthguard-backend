const Groq = require("groq-sdk");

// Apni .env file mein GROQ_API_KEY zaroor add karein
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); 

const analyzeWithGroq = async (content, searchContext) => {
  try {
    // AI ko context aur news dono bhej rahe hain
    const prompt = `
      You are an expert fact-checker. 
      Analyze this news content: "${content}"
      
      Here is some real-time context from the web: 
      ${JSON.stringify(searchContext)}
      
      Provide a verdict (REAL, FAKE, or UNVERIFIED) and a confidence score.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192", // Aap apna pasandida Groq model daal sakte hain
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;

    // Frontend ko result return kar rahe hain
    return {
      success: true,
      message: aiResponse,
      verdict: aiResponse.includes("FAKE") ? "FAKE" : "REAL", // Basic logic, aap ise apne hisaab se adjust kar sakte hain
      confidence: 85 // Dummy confidence, aap AI response se extract kar sakte hain
    };

  } catch (error) {
    console.error("❌ Error in Groq Service:", error);
    return { 
        success: false, 
        message: "Failed to analyze with Groq AI." 
    };
  }
};

module.exports = { analyzeWithGroq };