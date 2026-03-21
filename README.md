# Cursor-installer-generator
A tool to generate custom Windows cursor installers (.inf/.exe)
cursor-installer-generator/
│
├── README.md
├── package.json        # 如果用 Node
├── src/
│   ├── core/           # 核心逻辑
│   │   ├── generator.js
│   │   ├── infBuilder.js
│   │   └── filePackager.js
│   │
│   ├── templates/      # 模板
│   │   └── default.inf
│   │
│   └── cli/            # 命令行入口
│       └── index.js
│
├── assets/
│   └── cursors/        # 测试用鼠标文件
│
└── output/             # 生成的安装包
