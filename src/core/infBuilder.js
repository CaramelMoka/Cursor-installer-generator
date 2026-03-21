function generateInf(config) {
  const { name, files } = config;

  const fileList = Object.values(files);
  const regEntries = Object.entries(files);

  // 1. 文件列表
  const fileSection = fileList.map(f => f).join("\n");

  // 2. 注册表
  const regSection = regEntries
    .map(([key, file]) => {
      return `HKCU,"Control Panel\\Cursors","${key}",0,"%SystemRoot%\\Cursors\\${name}\\${file}"`;
    })
    .join("\n");

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
`.trim();
}

module.exports = { generateInf };
