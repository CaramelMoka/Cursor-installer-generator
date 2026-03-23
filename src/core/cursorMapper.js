// src/core/cursorMapper.js

/**
 * Windows 标准 cursor 类型关键词映射（带优先级）
 */
const CURSOR_KEYWORDS = [
  // ===== 状态类 =====
  { type: "Help", keywords: ["helpsel", "help", "question"] },
  { type: "AppStarting", keywords: ["appstarting", "working", "loading"] },
  { type: "Wait", keywords: ["wait", "busy"] },

  // ===== 精准类 =====
  { type: "Crosshair", keywords: ["precision", "cross"] },
  { type: "IBeam", keywords: ["ibeam", "text"] },
  { type: "NWPen", keywords: ["pen"] },

  // ===== 禁止 =====
  { type: "No", keywords: ["unavail", "forbidden", "notallowed", "no"] },

  // ===== 尺寸 =====
  { type: "SizeNS", keywords: ["sizens", "vertical", "ns"] },
  { type: "SizeWE", keywords: ["sizewe", "horizontal", "ew", "we"] },
  { type: "SizeNWSE", keywords: ["nwse"] },
  { type: "SizeNESW", keywords: ["nesw"] },

  // ===== 移动 =====
  { type: "SizeAll", keywords: ["move", "drag"] },

  // ===== 方向 =====
  { type: "UpArrow", keywords: ["uparrow", "up","候选"] },

  // ===== 点击 =====
  { type: "Hand", keywords: ["link", "select", "hand"] },

  // ===== 默认 =====
  { type: "Arrow", keywords: ["arrow", "normal", "default"] }
];

/**
 * ⭐ 根据文件名计算最佳匹配（带评分）
 */
function getBestMatch(filename) {
  const name = filename.toLowerCase();

  let bestType = null;
  let bestScore = 0;

  for (const entry of CURSOR_KEYWORDS) {
    for (const keyword of entry.keywords) {
      if (name.includes(keyword)) {
        const score = keyword.length; // ⭐ 越长越精确

        if (score > bestScore) {
          bestScore = score;
          bestType = entry.type;
        }
      }
    }
  }

  return { type: bestType, score: bestScore };
}

/**
 * ⭐ 自动映射（带权重控制）
 */
function autoMap(files, themeName = "CustomCursor") {
  const mapping = {};
  const scores = {}; // ⭐记录每个类型当前最佳分数

  files.forEach(file => {
    const { type, score } = getBestMatch(file);

    if (!type) return;

    // ⭐ 只有更优才覆盖
    if (!scores[type] || score > scores[type]) {
      mapping[type] = file;
      scores[type] = score;
    }
  });

  // ⭐ fallback（必须）
  if (!mapping.Arrow && files.length > 0) {
    mapping.Arrow = files[0];
  }

  return {
    name: themeName,
    files: mapping
  };
}

/**
 * ⭐ 找出未匹配文件（调试用）
 */
function findUnmatched(files, mapping) {
  const mappedFiles = Object.values(mapping);

  return files.filter(f => !mappedFiles.includes(f));
}

module.exports = {
  autoMap,
  findUnmatched
};