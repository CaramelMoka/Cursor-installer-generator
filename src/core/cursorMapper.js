
// src/core/cursorMapper.js

/**
 * 根据文件名猜测 cursor 类型
 */
function guessCursorType(filename) {
  const name = filename.toLowerCase();

  if (name.includes("arrow")) return "Arrow";
  if (name.includes("hand") || name.includes("link")) return "Hand";
  if (name.includes("text") || name.includes("ibeam")) return "IBeam";
  if (name.includes("wait") || name.includes("busy")) return "Wait";
  if (name.includes("help")) return "Help";

  return null; // 无法识别
}

/**
 * 自动映射文件列表 → cursor config
 */
function autoMap(files, themeName = "CustomCursor") {
  const mapping = {};

  files.forEach(file => {
    const type = guessCursorType(file);

    if (type && !mapping[type]) {
      mapping[type] = file;
    }
  });

  return {
    name: themeName,
    files: mapping
  };
}

module.exports = { autoMap };
