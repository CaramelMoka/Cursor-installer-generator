
// src/core/validator.js

const { CURSOR_KEYS, DEFAULT_FALLBACK } = require("./cursorSchema");

/**
 * 校验并补全 cursor 配置
 */
function validateAndFix(config) {
  const result = { ...config, files: { ...config.files } };

  // ❗ 删除非法 key
  Object.keys(result.files).forEach(key => {
    if (!CURSOR_KEYS.includes(key)) {
      delete result.files[key];
    }
  });

  // ❗ 补默认 Arrow（否则系统会炸）
  if (!result.files.Arrow && DEFAULT_FALLBACK.Arrow) {
    result.files.Arrow = DEFAULT_FALLBACK.Arrow;
  }

  return result;
}

module.exports = { validateAndFix };
