const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { execSync } = require("child_process");

// ⭐ 引入 core（关键）
const { processInput } = require("./src/core/inputProcessor");
const { validateAndFix } = require("./src/core/validator");

const app = express();

app.use(cors({
  exposedHeaders: ["X-Mapping"]
}));

const upload = multer({ dest: "temp/" });

app.post("/generate", upload.array("files"), async (req, res) => {
  try {
    const uploadedFiles = req.files.map(f => f.originalname);

    // =========================
    // 1️⃣ 用 core 处理输入
    // =========================
    const themeName = req.body.themeName || "MyCursor";

    const config = processInput({
      files: uploadedFiles,
      name: themeName // 后面可以改成前端传
    });

    const finalConfig = validateAndFix(config);

    console.log("🧠 Final mapping:", finalConfig);

    // =========================
    // 2️⃣ build 目录
    // =========================
    const buildDir = path.join(__dirname, "build", themeName);
    fs.mkdirSync(buildDir, { recursive: true });

    // =========================
    // 3️⃣ 复制文件
    // =========================
    req.files.forEach(file => {
      const dest = path.join(buildDir, file.originalname);
      fs.renameSync(file.path, dest);
    });

    // =========================
    // 4️⃣ 生成 NSIS
    // =========================
    const installerDir = path.join(__dirname, "installer");
    fs.mkdirSync(installerDir, { recursive: true });

    const nsiPath = path.join(installerDir, "installer.nsi");

    // ⭐ 固定顺序（防止最后一个丢失）
    const orderedKeys = [
      "Arrow","Help","AppStarting","Wait","Crosshair",
      "IBeam","NWPen","No","SizeNS","SizeWE",
      "SizeNWSE","SizeNESW","SizeAll","UpArrow","Hand"
    ];

    const regLines = orderedKeys
      .filter(key => finalConfig.files[key])
      .map(key => {
        const file = finalConfig.files[key];
        return `WriteRegExpandStr HKCU "Control Panel\\\\Cursors" "${key}" "%SystemRoot%\\\\Cursors\\\\${themeName}\\\\${file}"`;
      })
      .join("\n") + "\n\n";

    const nsiContent = `
Outfile "${themeName}_Installer.exe"
RequestExecutionLevel admin

Section
  SetOutPath "$WINDIR\\\\Cursors\\\\${themeName}"
  File /r "../build/${themeName}/*"

  ${regLines}

  System::Call 'user32::SystemParametersInfo(i 87, i 0, i 0, i 0)'
SectionEnd
`;

    fs.writeFileSync(nsiPath, nsiContent);

    //等100ms
    await new Promise(r => setTimeout(r, 100));


    // =========================
    // 5️⃣ 编译 EXE
    // =========================
    execSync("makensis installer.nsi", { cwd: installerDir });

    const exePath = path.join(installerDir, `${themeName}_Installer.exe`);

    res.setHeader("X-Mapping", JSON.stringify(finalConfig.files));

    res.download(exePath, () => {
      fs.rmSync("temp", { recursive: true, force: true });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Build failed");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
