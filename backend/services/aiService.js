const fetch = require("node-fetch");

/**
 * Call local Ollama API with a prompt
 * @param {string} model - model name (e.g. "codellama", "llama3")
 * @param {string} prompt - user question/code context
 * @returns {Promise<string>}
 */
async function runOllama(model, prompt) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}

module.exports = { runOllama };