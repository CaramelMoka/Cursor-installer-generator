
// src/core/inputProcessor.js

const { autoMap } = require("./cursorMapper");

/**
 * 处理用户输入
 * @param {Object} input
 * @param {string[]} input.files
 * @param {Object} [input.manualMap]
 */
function processInput(input) {
  // 👉 优先用用户手动映射
  if (input.manualMap) {
    return {
      name: input.name || "CustomCursor",
      files: input.manualMap
    };
  }

  // 👉 否则自动识别
  return autoMap(input.files, input.name);
}

module.exports = { processInput };
