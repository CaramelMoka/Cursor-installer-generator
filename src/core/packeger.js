
// src/core/packager.js

const path = require("path");
const fs = require("fs");

const { generateInf } = require("./infBuilder");
const { ensureDir, copyFile } = require("../utils/fileUtils");

/**
 * 生成完整安装包目录
 */
function buildPackage(config, inputDir, outputDir) {
  const themeDir = path.join(outputDir, config.name);

  // 创建目录
  ensureDir(themeDir);

  // 复制 cursor 文件
  Object.values(config.files).forEach(file => {
    const src = path.join(inputDir, file);
    const dest = path.join(themeDir, file);

    copyFile(src, dest);
  });

  // 生成 .inf
  const infContent = generateInf(config);
  fs.writeFileSync(path.join(themeDir, `${config.name}.inf`), infContent);

  return themeDir;
}

module.exports = { buildPackage };
