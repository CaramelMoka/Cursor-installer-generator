// src/cli/index.js

const path = require("path");

const { processInput } = require("../core/inputProcessor");
const { validateAndFix } = require("../core/validator");
const { buildPackage } = require("../core/packager");

// 👉 模拟输入（后面会换成前端）
const input = {
  name: "MyCursor",
  files: [
    "arrow.cur",
    "hand.cur",
    "busy.ani"
  ]
};

const inputDir = path.resolve("./assets/cursors");
const outputDir = path.resolve("./output");

// 1️⃣ 处理输入
let config = processInput(input);

// 2️⃣ 校验 + 修复
config = validateAndFix(config);

// 3️⃣ 打包
const result = buildPackage(config, inputDir, outputDir);

console.log("✅ Generated at:", result);
