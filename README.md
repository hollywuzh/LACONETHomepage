# LACONET 低空计算网络组会平台

面向组内学生日常使用的静态网站，用于展示组会安排、文献解读、历史归档、设备登记、汇报模板与研究方向入口。

## 本地预览

由于页面会读取 `data/*.csv` 和 `notes/*.md`，建议通过本地静态服务预览：

```powershell
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## GitHub Pages 部署

1. 将本仓库推送到 GitHub。
2. 打开仓库 `Settings` -> `Pages`。
3. `Build and deployment` 选择 `Deploy from a branch`。
4. 分支选择 `main`，目录选择 `/root`。
5. 保存后等待 GitHub Pages 发布。

## 日常更新方式

网站采用“CSV 管索引，Markdown 写内容”的方式维护。

- 更新组会安排：编辑 `data/meetings.csv`
- 更新文献列表：编辑 `data/papers.csv`
- 新增文献解读：在 `notes/` 下新增一篇与 `papers.csv` 中 `id` 对应的 Markdown
- 更新设备台账：编辑 `data/equipment.csv`
- 更新设备使用记录：编辑 `data/equipment-usage.csv`
- 修改汇报模板：编辑 `templates/` 下的 Markdown

模板文件建议通过 `templates.html` 页面预览、复制或下载，不建议在导航中直接链接裸 `.md` 文件，避免浏览器编码识别导致中文显示异常。

详细字段约定见 [docs/data-schema.md](docs/data-schema.md)。

更新与发布流程见 [docs/update-workflow.md](docs/update-workflow.md)。

## 目录结构

```text
.
├── index.html
├── papers.html
├── paper.html
├── archive.html
├── equipment.html
├── templates.html
├── directions.html
├── data/
│   ├── meetings.csv
│   ├── papers.csv
│   ├── equipment.csv
│   └── equipment-usage.csv
├── notes/
│   └── all-sky-autonomous-computing-uav-swarm-2024.md
├── templates/
│   ├── literature-note-template.md
│   ├── meeting-record-template.md
│   └── slides-checklist.md
└── assets/
    ├── css/styles.css
    └── js/
        ├── data.js
        └── main.js
```
