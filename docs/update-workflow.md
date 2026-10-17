# LACONET 网站更新与发布流程

网站部署在 GitHub Pages：

https://hollywuzh.github.io/LACONETHomepage/

日常更新遵循一个原则：先改本地文件，确认页面正常，再提交并推送到 GitHub。

## 常用更新位置

- 组会安排：`data/meetings.csv`
- 文献索引：`data/papers.csv`，按 PID 管理论文本身
- 汇报索引：`data/reports.csv`，按 RID 管理每次组会汇报
- 文献解读正文：`notes/{RID}.md`
- 会议纪要正文：`records/*.md`
- 实验室设备台账：`data/equipment.csv`
- 设备使用记录：`data/equipment-usage.csv`
- 共享资源目录：`resources.html`，收录仿真平台、代码与现有资料入口
- 汇报模板：`templates/*.md`

## 本地预览

在项目目录 `E:\laconethomepage` 中运行：

```powershell
python -m http.server 8080
```

浏览器打开：

```text
http://127.0.0.1:8080/
```

检查首页、文献解读库、模板页和设备登记页是否正常。

## 新增文献与汇报

### 新论文第一次汇报

1. 检查论文是否已有 DOI。
2. 有 DOI 时生成 PID：把 DOI 中的 `/` 替换为 `_`，并加上 `DOI-` 前缀，例如 `DOI-10.1109_ACCESS.2024.3361284`。
3. 无 DOI 时先查重，确认未入库后分配 `LIT-年份-流水号`。
4. 在 `data/papers.csv` 新增 PID 级论文信息，PDF 入口只在这里填写一次。
5. 按 `RPT-YYYYMMDD-学生唯一编号` 生成 RID。
6. 在 `data/reports.csv` 新增 RID 级汇报信息，填写 PPT、Markdown、讨论问题和本次验证材料入口。
7. 在 `data/meetings.csv` 的 `report_ids` 字段关联本次 RID。
8. 在 `notes/` 下新增 `RID.md`，使用模板页中的文献解读模板。

### 已入库论文再次汇报

1. 复用已有 PID，不重复新增 `data/papers.csv` 行。
2. 不重复提交 PDF，除非原 PDF 链接失效或需要更换合法入口。
3. 新建一个 RID，并在 `data/reports.csv` 中关联同一个 PID。
4. 本次 PPT、Markdown 和讨论问题按 RID 单独保存。
5. 对应组会在 `data/meetings.csv` 的 `report_ids` 中加入这个 RID。

## 提交并推送

确认页面无误后，在 `E:\laconethomepage` 中运行：

```powershell
git status
git add .
git commit -m "Update seminar information"
git push
```

推送完成后等待 GitHub Pages 自动刷新。通常几十秒到几分钟后，线上页面会更新。

## 推荐提交信息

- 更新组会安排：`Update seminar schedule`
- 新增入库文献：`Add paper entry`
- 新增汇报记录：`Add report entry`
- 更新文献解读：`Add literature report note`
- 更新会议纪要：`Add meeting minutes`
- 更新模板：`Update presentation templates`
- 更新设备信息：`Update equipment registry`

## 注意事项

- 不要直接修改网页生成后的缓存内容，优先修改 CSV 或 Markdown 源文件。
- 公开仓库中不要放敏感会议密码、私人手机号、未授权论文 PDF 或内部数据。
- 如果腾讯会议链接、PPT、PDF 只限组内使用，建议在 CSV 中写 `内部链接` 或使用受控网盘链接。
