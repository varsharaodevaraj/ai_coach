// utils/ollamaClient.js
const ollama = require('ollama'); // make sure you installed & configured ollama sdk

// Simple wrapper to query Ollama
async function askAI(prompt) {
  try {
    const response = await ollama.chat({
      model: "llama3", // or "codellama"
      messages: [
        { role: "system", content: "You are a helpful coding mentor." },
        { role: "user", content: prompt }
      ],
      stream: false // ✅ ensures we get a full message instead of chunks
    });

    return response.message?.content || "No response from AI.";
  } catch (err) {
    console.error("AI request failed:", err);
    return "AI feedback unavailable.";
  }
}


module.exports = { askAI };