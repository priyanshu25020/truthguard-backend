require('dotenv').config();
const axios = require('axios'); // Hum axios ka use kar rahe hain network request ke liye

const searchWithTavily = async (query) => {
  try {
    console.log(`Tavily searching live web for: "${query.substring(0, 50)}..."`);

    // Tavily API ko POST request bhej rahe hain
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      search_depth: "advanced", // 'advanced' deep search ke liye, 'basic' fast ke liye
      max_results: 4, // 4 results sufficient hote hain context ke liye
      include_answer: false
    });

    const results = response.data.results;

    if (!results || results.length === 0) {
      console.log("Tavily: No live results found.");
      return "No live search results found on the internet.";
    }

    // 🔴 Groq ke padhne layak format mein data ko convert kar rahe hain
    let searchContext = "LIVE SEARCH RESULTS:\n\n";
    
    results.forEach((item, index) => {
      searchContext += `[Source ${index + 1}]: ${item.title}\n`;
      searchContext += `URL: ${item.url}\n`;
      searchContext += `Snippet/Facts: ${item.content}\n\n`;
    });

    console.log("Tavily search complete! Context generated.");
    return searchContext;

  } catch (error) {
    console.error("Error in Tavily Service:", error.response?.data || error.message);
    // Fallback: Agar search fail ho jaye (jaise API limit), toh app crash na ho, 
    // balki Groq ko warning mil jaye ki wo carefully apne base dimaag se answer de.
    return "Search failed or API unavailable. Rely on your internal knowledge but remain highly skeptical.";
  }
};

module.exports = { searchWithTavily };