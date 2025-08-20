// utils/codeRunner.js
const { VM } = require('vm2');

/**
 * Runs user code safely against test cases.
 * @param {string} code - User submitted code
 * @param {Array} testCases - Array of { input: any[], expected: any }
 * @returns {Array} results - Array of { input, expected, output, pass }
 */
async function runTests(code, testCases = []) {
  const results = [];

  try {
    // Wrap user code inside a VM (sandboxed execution)
    const vm = new VM({
      timeout: 1000, // 1s per test
      sandbox: {}
    });

    // Load user code into the VM
    vm.run(code);

    // User should define a function called "solve"
    const solve = vm.run("solve");

    if (typeof solve !== "function") {
      throw new Error("User code must define a function named 'solve'");
    }

    // Run each test case
    for (let tc of testCases) {
      let output;
      let pass = false;

      try {
        output = solve(...tc.input); // Spread inputs
        pass = JSON.stringify(output) === JSON.stringify(tc.expected);
      } catch (err) {
        output = `Error: ${err.message}`;
      }

      results.push({
        input: tc.input,
        expected: tc.expected,
        output,
        pass
      });
    }
  } catch (err) {
    results.push({ error: err.message });
  }

  return results;
}

module.exports = { runTests };