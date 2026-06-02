const express = require('express');
const router = express.Router();
const axios = require('axios'); // 🔥 Axios import kiya Groq API hit karne ke liye

// POST request: http://localhost:5000/api/threat-report
router.post('/threat-report', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Aapke backend ke .env se GROQ_API_KEY uthayega
    const apiKey = process.env.GROQ_API_KEY; 

    if (!apiKey) {
      return res.status(500).json({ error: "Configuration Error: GROQ_API_KEY is missing in backend .env" });
    }

    // Groq API ko cloud par request hit karenge
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
       model: "llama-3.1-8b-instant", // Standard fast model
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" } // Strict JSON response ke liye
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Groq se aaya data directly frontend ko bhej do
    res.json(response.data);

  } catch (error) {
    console.error("Backend Groq Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to communicate with Threat Intelligence AI Node" });
  }
});

module.exports = router;