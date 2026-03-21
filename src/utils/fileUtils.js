// src/utils/fileUtils.js

const fs = require("fs");
const path = require("path");

/**
 * 复制文件
 */
function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
}

/**
 * 确保目录存在
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

module.exports = {
  copyFile,
  ensureDir
};
