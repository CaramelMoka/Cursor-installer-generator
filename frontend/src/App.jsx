import { useState } from "react";

export default function App() {
  // ⭐ mapping（来自后端）
  const [mapping, setMapping] = useState(null);

  // ⭐ 上传文件（用于 preview）
  const [files, setFiles] = useState([]);

  // ⭐ 主题名
  const [themeName, setThemeName] = useState("MyCursor");

  /**
   * 上传文件
   */
  const handleUpload = (fileList) => {
    const arr = Array.from(fileList);
    setFiles(arr);
    setMapping(null);
  };

  /**
   * 生成 installer
   */
  const handleGenerate = async () => {
    const input = document.querySelector('input[type="file"]');

    const formData = new FormData();

    // ⭐ 上传文件
    Array.from(input.files).forEach(file => {
      formData.append("files", file);
    });

    // ⭐ 主题名
    formData.append("themeName", themeName);

    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      body: formData
    });

    // ⭐ DEBUG（关键）
    const mappingHeader = res.headers.get("X-Mapping");
    console.log("HEADER:", mappingHeader);

    if (mappingHeader) {
      const serverMapping = JSON.parse(mappingHeader);
      console.log("MAPPING:", serverMapping);
      setMapping(serverMapping);
    } else {
      console.error("❌ 没拿到 mapping（CORS问题）");
    }

    // ⭐ 下载 EXE
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${themeName}_Installer.exe`;
    a.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Cursor Installer Generator</h1>

      {/* ⭐ Theme 输入 */}
      <div style={{ marginBottom: 10 }}>
        <label>Theme Name: </label>
        <input
          type="text"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
        />
      </div>

      {/* ⭐ 上传 */}
      <input
        type="file"
        multiple
        onChange={(e) => handleUpload(e.target.files)}
      />

      {/* ⭐ 按钮 */}
      <button
        onClick={handleGenerate}
        style={{ marginTop: 20, padding: "10px 20px" }}
      >
        Generate Installer
      </button>

      {/* ⭐ 表格（Excel UI） */}
      {mapping && (
        <div style={{ marginTop: 30 }}>
          <h3>Detected Mapping (Server)</h3>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Cursor Type</th>
                <th>File</th>
                <th>Preview</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(mapping).map(([type, fileName]) => {
                const fileObj = files.find(f => f.name === fileName);

                return (
                  <tr key={type}>
                    <td>{type}</td>

                    <td>{fileName}</td>

                    <td>
                      {fileObj ? (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            border: "1px solid #ccc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer"
                          }}
                          title="Hover to preview cursor"

                          // ⭐ ani 预览核心
                          onMouseEnter={() => {
                            const url = URL.createObjectURL(fileObj);
                            document.body.style.cursor = `url(${url}), auto`;
                          }}

                          onMouseLeave={() => {
                            document.body.style.cursor = "default";
                          }}
                        >
                          {fileName.endsWith(".ani") ? "🌀" : "🖱️"}
                        </div>
                      ) : (
                        "No Preview"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
