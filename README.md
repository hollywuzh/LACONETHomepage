# LACONET 低空计算网络组会平台

面向组内学生日常使用的静态网站，用于展示组会安排、文献解读、历史归档、设备登记、共享资源、汇报模板与研究方向入口。

## 本地预览

由于页面会读取 `data/*.csv`、`notes/*.md` 和 `records/*.md`，建议通过本地静态服务预览：

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

网站采用“CSV 管索引，Markdown 写内容”的方式维护，并区分 PID 与 RID。

- 更新组会安排：编辑 `data/meetings.csv`
- 更新入库文献：编辑 `data/papers.csv`，一篇论文只对应一个 PID
- 新增汇报记录：编辑 `data/reports.csv`，每次汇报对应一个 RID
- 新增文献解读：在 `notes/` 下新增一篇与 `reports.csv` 中 `rid` 对应的 Markdown
- 新增会议纪要：在 `records/` 下新增一篇与 `meetings.csv` 中 `id` 对应的 Markdown
- 更新设备台账：编辑 `data/equipment.csv`
- 更新设备使用记录：编辑 `data/equipment-usage.csv`
- 更新共享资源：编辑 `resources.html`，补充资源名称、用途、来源和访问入口
- 修改汇报模板：编辑 `templates/` 下的 Markdown

## PID 与 RID 规则

- PID 标识论文本身：有 DOI 时优先采用规范化 DOI，例如 `DOI-10.1109_ACCESS.2024.3361284`。
- 无 DOI 的文献查重后，由平台分配 `LIT-年份-流水号`，例如 `LIT-2026-0001`。
- RID 标识某次汇报：格式为 `RPT-YYYYMMDD-学生唯一编号`，例如 `RPT-20260618-REN-YU`。
- 同一篇论文只有一个 PID，但可以关联多个 RID。
- PDF 按 PID 只保存一份；PPT、Markdown 按 RID 分别保存每次汇报记录。
- 已入库文献无需重复提交 PDF，只需复用 PID 并在 `data/reports.csv` 新建 RID。

模板文件建议通过 `templates.html` 页面预览、复制或下载，不建议在导航中直接链接裸 `.md` 文件，避免浏览器编码识别导致中文显示异常。

详细字段约定见 [docs/data-schema.md](docs/data-schema.md)。

更新与发布流程见 [docs/update-workflow.md](docs/update-workflow.md)。

## 目录结构

```text
.
├── index.html
├── papers.html
├── paper.html
├── report.html
├── meeting.html
├── archive.html
├── equipment.html
├── templates.html
├── resources.html
├── directions.html
├── data/
│   ├── meetings.csv
│   ├── papers.csv
│   ├── reports.csv
│   ├── equipment.csv
│   └── equipment-usage.csv
├── notes/
│   └── RPT-20260618-REN-YU.md
├── records/
│   └── meeting-2026-06-18.md
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
