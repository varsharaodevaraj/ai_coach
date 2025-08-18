const { exec } = require('child_process');

/**
 * Run a local Ollama model with a prompt
 * @param {string} model - model name (e.g. "codellama", "llama3")
 * @param {string} prompt - user question/code context
 * @returns {Promise<string>}
 */
function runOllama(model, prompt) {
  return new Promise((resolve, reject) => {
    exec(`echo "${prompt}" | ollama run ${model}`, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      resolve(stdout.trim());
    });
  });
}

module.exports = { runOllama };