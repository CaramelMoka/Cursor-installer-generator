// src/core/infBuilder.js

/**
 * 生成 Windows 鼠标安装用的 .inf 文件
 * @param {Object} config
 * @param {string} config.name - 鼠标主题名称（用于文件夹名）
 * @param {Object} config.files - 鼠标映射（系统key → 文件名）
 */
function generateInf(config) {
  const { name, files } = config;

  // 👉 提取所有文件名（用于 [CursorFiles]）
  const fileList = Object.values(files);

  // 👉 提取 key + 文件（用于注册表）
  const regEntries = Object.entries(files);

  // =========================
  // 📦 1. 生成文件复制列表
  // =========================
  // 结果：
  // arrow.cur
  // hand.cur
  const fileSection = fileList
    .map(file => file) // 这里其实可以扩展（比如校验文件）
    .join("\n");

  // =========================
  // 🧬 2. 生成注册表部分
  // =========================
  // 结果：
  // HKCU,"Control Panel\Cursors","Arrow",0,"路径"
  const regSection = regEntries
    .map(([cursorKey, file]) => {
      return `HKCU,"Control Panel\\Cursors","${cursorKey}",0,"%SystemRoot%\\Cursors\\${name}\\${file}"`;
    })
    .join("\n");

  // =========================
  // 🧱 3. 拼接整个 .inf 文件
  // =========================
  return `
[Version]
Signature="$Windows NT$"

[DefaultInstall]
CopyFiles=CursorFiles
AddReg=CursorReg

[DestinationDirs]
CursorFiles=10,"%SystemRoot%\\Cursors\\${name}"

[CursorFiles]
${fileSection}

[CursorReg]
${regSection}
`.trim(); // 去掉首尾空行
}

module.exports = { generateInf };
